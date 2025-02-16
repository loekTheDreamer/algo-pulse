import type {AccountInfo} from '../api/api';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {watchAddress} from '../api/api';

export interface WatcherListItem extends AccountInfo {
  dateAdded: string;
}

interface WatcherListStore {
  watchers: Map<string, WatcherListItem>;
  lastKnownStates: Map<string, AccountInfo>;
  isCheckingStates: boolean;
  addWatcherItem: (item: WatcherListItem) => void;
  removeWatcherItem: (item: WatcherListItem) => void;
  clearWatcherList: () => void;
  getWatcherList: () => WatcherListItem[];
  checkStateChanges: () => Promise<void>;
  startPeriodicCheck: () => void;
  stopPeriodicCheck: () => void;
}

// Custom storage for Map serialization
const mapStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      console.log('🔍 Getting item from storage:', name);
      const value = await AsyncStorage.getItem(name);
      console.log('📦 Raw storage value:', value);

      if (value === null) {
        console.log('❌ No value found in storage');
        return null;
      }

      const parsed = JSON.parse(value);
      console.log('🔄 Parsed storage value:', JSON.stringify(parsed, null, 2));

      // Initialize empty state if needed
      if (!parsed.state) {
        console.log('⚠️ No state found in parsed data');
        return JSON.stringify({
          state: {
            watchers: new Map(),
            lastKnownStates: new Map(),
            isCheckingStates: false,
          },
        });
      }

      // Convert arrays to Maps
      const watchers = Array.isArray(parsed.state.watchers)
        ? new Map(parsed.state.watchers)
        : new Map();
      const lastKnownStates = Array.isArray(parsed.state.lastKnownStates)
        ? new Map(parsed.state.lastKnownStates)
        : new Map();

      const result = {
        ...parsed,
        state: {
          ...parsed.state,
          watchers,
          lastKnownStates,
        },
      };

      console.log(
        '✅ Returning processed state:',
        JSON.stringify(
          result,
          (key, value) => {
            if (value instanceof Map) {
              return Array.from(value.entries());
            }
            return value;
          },
          2,
        ),
      );

      return JSON.stringify(result);
    } catch (error) {
      console.error('❌ Error reading from storage:', error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      console.log('💾 Setting item in storage:', name);
      console.log('📥 Input value:', value);

      const parsed = JSON.parse(value);
      console.log('🔄 Parsed input:', JSON.stringify(parsed, null, 2));

      if (!parsed.state) {
        console.log('⚠️ No state found in input');
        return;
      }

      // Ensure we have Maps before trying to convert them
      const watchers =
        parsed.state.watchers instanceof Map
          ? Array.from(parsed.state.watchers.entries())
          : [];
      const lastKnownStates =
        parsed.state.lastKnownStates instanceof Map
          ? Array.from(parsed.state.lastKnownStates.entries())
          : [];

      const serialized = JSON.stringify({
        ...parsed,
        state: {
          ...parsed.state,
          watchers,
          lastKnownStates,
        },
      });

      console.log('📤 Saving to storage:', serialized);
      await AsyncStorage.setItem(name, serialized);
      console.log('✅ Successfully saved to storage');
    } catch (error) {
      console.error('❌ Error writing to storage:', error);
      console.log('📋 Debug info:', {
        valueType: typeof value,
        valueLength: value.length,
        parsedStateType: value ? typeof JSON.parse(value).state : 'undefined',
      });
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      console.log('🗑️ Removing item from storage:', name);
      await AsyncStorage.removeItem(name);
      console.log('✅ Successfully removed from storage');
    } catch (error) {
      console.error('❌ Error removing from storage:', error);
    }
  },
};

let checkInterval: NodeJS.Timeout | null = null;

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    (set, get) => ({
      watchers: new Map<string, WatcherListItem>(),
      lastKnownStates: new Map<string, AccountInfo>(),
      isCheckingStates: false,
      addWatcherItem: (item: WatcherListItem) =>
        set(state => {
          if (state.watchers.has(item.address)) {
            console.log('Item already exists');
            return state;
          }
          const newWatchers = new Map(state.watchers);
          newWatchers.set(item.address, {
            ...item,
            dateAdded: new Date().toISOString(),
          });
          return {watchers: newWatchers};
        }),
      removeWatcherItem: (item: WatcherListItem) =>
        set(state => {
          const newWatchers = new Map(state.watchers);
          newWatchers.delete(item.address);
          return {watchers: newWatchers};
        }),
      clearWatcherList: () => set(() => ({watchers: new Map()})),
      getWatcherList: () => Array.from(get().watchers.values()),

      checkStateChanges: async () => {
        const state = get();
        if (state.isCheckingStates) {
          return;
        }

        set({isCheckingStates: true});

        try {
          const addresses = Array.from(state.watchers.keys());
          for (const address of addresses) {
            const response = await watchAddress(address);
            if (response.data) {
              const lastState = state.lastKnownStates.get(address);
              const newState = response.data;

              // Compare relevant state changes
              if (lastState) {
                const hasChanges =
                  lastState.amount !== newState.amount ||
                  lastState['amount-without-pending-rewards'] !==
                    newState['amount-without-pending-rewards'] ||
                  lastState.assets?.length !== newState.assets?.length ||
                  lastState['created-assets']?.length !==
                    newState['created-assets']?.length ||
                  lastState.round !== newState.round;

                if (hasChanges) {
                  console.log(`State changed for address: ${address}`);
                  // Update the watcher item with new state
                  set(() => {
                    const newWatchers = new Map(state.watchers);
                    const currentWatcher = state.watchers.get(address);
                    if (currentWatcher) {
                      newWatchers.set(address, {
                        ...newState,
                        dateAdded: currentWatcher.dateAdded,
                      });
                    }
                    const newLastKnownStates = new Map(state.lastKnownStates);
                    newLastKnownStates.set(address, newState);
                    return {
                      watchers: newWatchers,
                      lastKnownStates: newLastKnownStates,
                    };
                  });
                }
              } else {
                // First time checking this address
                set(() => ({
                  lastKnownStates: {
                    ...state.lastKnownStates,
                    [address]: newState,
                  },
                }));
              }
            }
          }
        } catch (error) {
          console.error('Error checking state changes:', error);
        } finally {
          set({isCheckingStates: false});
        }
      },

      startPeriodicCheck: () => {
        if (checkInterval) {
          return;
        }

        // Start immediate check
        get().checkStateChanges();

        // Set up periodic check every 60 seconds
        checkInterval = setInterval(() => {
          get().checkStateChanges();
        }, 60000);
      },

      stopPeriodicCheck: () => {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      },
    }),
    {
      name: 'watcher-storage',
      storage: createJSONStorage(() => mapStorage),
      version: 1, // Add version to handle potential future schema changes
    },
  ),
);

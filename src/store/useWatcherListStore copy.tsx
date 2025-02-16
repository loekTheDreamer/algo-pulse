import type {AccountInfo} from '../api/api';
import {watchAddress} from '../api/api';
import {create} from 'zustand';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {detectStateChanges} from '../utils/stateChanges';

// Custom storage to handle Map serialization
const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name);
    if (value) {
      const parsed = JSON.parse(value);
      // Convert map entries back to Map
      parsed.watcherMap = new Map(Object.entries(parsed.watcherMap));
      return JSON.stringify(parsed);
    }
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const parsed = JSON.parse(value);
    // Convert Map to object for storage
    parsed.watcherMap = Object.fromEntries(parsed.watcherMap);
    await AsyncStorage.setItem(name, JSON.stringify(parsed));
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

export interface WatcherListItem {
  currentState: AccountInfo;
  previousState: AccountInfo | null;
  dateAdded: string;
  lastChecked: string;
  hasChanges: boolean;
}

interface WatcherListStore {
  // Use a Map for O(1) lookups
  watcherMap: Map<string, WatcherListItem>;
  // Keep a separate array for ordered access (UI rendering)
  orderedAddresses: string[];
  // Batch processing
  batchSize: number;
  currentBatchIndex: number;
  checkInterval?: NodeJS.Timer;

  // Methods
  addWatcherItem: (item: AccountInfo) => void;
  removeWatcherItem: (address: string) => void;
  clearWatcherList: () => void;
  updateAccountState: (address: string, newState: AccountInfo) => void;
  startPeriodicCheck: () => void;
  stopPeriodicCheck: () => void;
  getWatcherList: () => WatcherListItem[];
}

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    set => ({
      watcherMap: new Map(),
      orderedAddresses: [],
      batchSize: 50, // Process 50 addresses per minute
      currentBatchIndex: 0,
      addWatcherItem: (item: AccountInfo) =>
        set(state => {
          // O(1) lookup
          if (state.watcherMap.has(item.address)) {
            return state;
          }

          const newItem: WatcherListItem = {
            currentState: item,
            previousState: null,
            dateAdded: new Date().toISOString(),
            lastChecked: new Date().toISOString(),
            hasChanges: false,
          };

          // Update both map and ordered array
          const newMap = new Map(state.watcherMap);
          newMap.set(item.address, newItem);

          return {
            watcherMap: newMap,
            orderedAddresses: [...state.orderedAddresses, item.address],
          };
        }),
      removeWatcherItem: (address: string) =>
        set(state => {
          const newMap = new Map(state.watcherMap);
          newMap.delete(address);

          return {
            watcherMap: newMap,
            orderedAddresses: state.orderedAddresses.filter(
              addr => addr !== address,
            ),
          };
        }),

      updateAccountState: (address: string, newState: AccountInfo) =>
        set(state => {
          const item = state.watcherMap.get(address);
          if (!item) return state;

          const hasChanges = detectStateChanges(item.currentState, newState);
          const updatedItem = {
            ...item,
            previousState: item.currentState,
            currentState: newState,
            lastChecked: new Date().toISOString(),
            hasChanges,
          };

          const newMap = new Map(state.watcherMap);
          newMap.set(address, updatedItem);

          return {watcherMap: newMap};
        }),

      startPeriodicCheck: () => {
        const intervalId = setInterval(async () => {
          const state = useWatcherListStore.getState();
          const addresses = state.orderedAddresses;

          // Process addresses in batches
          const startIdx = state.currentBatchIndex * state.batchSize;
          const endIdx = Math.min(startIdx + state.batchSize, addresses.length);
          const currentBatch = addresses.slice(startIdx, endIdx);

          // Process current batch
          await Promise.all(
            currentBatch.map(async address => {
              try {
                const response = await watchAddress(address);
                if (response.data) {
                  state.updateAccountState(address, response.data);
                }
              } catch (error) {
                console.error(`Error checking address ${address}:`, error);
              }
            }),
          );

          // Update batch index for next iteration
          set(state => ({
            currentBatchIndex:
              endIdx >= addresses.length
                ? 0 // Reset to start if we've processed all addresses
                : state.currentBatchIndex + 1,
          }));
        }, 60000); // 60 seconds

        set({checkInterval: intervalId});
      },

      stopPeriodicCheck: () => {
        set(state => {
          if (state.checkInterval) {
            clearInterval(state.checkInterval);
          }
          return {checkInterval: undefined};
        });
      },
      clearWatcherList: () =>
        set(() => ({
          watcherMap: new Map(),
          orderedAddresses: [],
          currentBatchIndex: 0,
        })),

      getWatcherList: () => {
        const state = useWatcherListStore.getState();
        return state.orderedAddresses.map(
          address => state.watcherMap.get(address)!,
        );
      },
    }),
    {
      name: 'watcher-storage',
      storage: customStorage,
    },
  ),
);

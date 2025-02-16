import type {AccountInfo} from '../api/api';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {watchAddress} from '../api/api';
import {useToastStore} from './useToastStore';
import {formatWalletAddress} from '../utils/formatters';

export interface WatcherListItem extends AccountInfo {
  dateAdded: string;
}

interface WatcherListStore {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  watchers: Record<string, WatcherListItem>;
  lastKnownStates: Record<string, AccountInfo>;
  isCheckingStates: boolean;
  addWatcherItem: (item: WatcherListItem) => void;
  removeWatcherItem: (item: WatcherListItem) => void;
  clearWatcherList: () => void;
  getWatcherList: () => WatcherListItem[];
  checkStateChanges: () => Promise<void>;
  startPeriodicCheck: () => void;
  stopPeriodicCheck: () => void;
}

let checkInterval: NodeJS.Timeout | null = null;

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      watchers: {},
      lastKnownStates: {},
      isCheckingStates: false,
      addWatcherItem: (item: WatcherListItem) =>
        set(state => {
          if (state.watchers[item.address]) {
            console.log('Item already exists');
            return state;
          }
          return {
            watchers: {
              ...state.watchers,
              [item.address]: {
                ...item,
                dateAdded: new Date().toISOString(),
              },
            },
          };
        }),
      removeWatcherItem: (item: WatcherListItem) =>
        set(state => {
          const newWatchers = {...state.watchers};
          delete newWatchers[item.address];
          return {watchers: newWatchers};
        }),
      clearWatcherList: () => set(() => ({watchers: {}})),
      getWatcherList: () => Object.values(get().watchers),

      checkStateChanges: async () => {
        const state = get();
        if (state.isCheckingStates) {
          return;
        }

        set({isCheckingStates: true});

        try {
          const addresses = Object.keys(state.watchers);
          for (const address of addresses) {
            const response = await watchAddress(address);
            if (response.data) {
              const lastState = state.lastKnownStates[address];
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
                  useToastStore.getState().showToast(`Changes detected for address: ${formatWalletAddress(address)}`, 'info');
                  // Update the watcher item with new state
                  set(() => ({
                    watchers: {
                      ...state.watchers,
                      [address]: {
                        ...newState,
                        dateAdded: state.watchers[address].dateAdded,
                      },
                    },
                    lastKnownStates: {
                      ...state.lastKnownStates,
                      [address]: newState,
                    },
                  }));
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
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

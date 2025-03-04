import type {WatcherListItem, WatcherListStore} from '@/types/watcherList';

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {watchAddress} from '@/api/api';
import {fetchAlgoPrice} from '../api/priceAPI';
import {useToastStore} from '@/store/useToastStore';
import {formatWalletAddress} from '@/utils/formatters';
import {compareAccountStates} from '@/utils/stateComparison';

let checkInterval: ReturnType<typeof setInterval> | null = null;

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({_hasHydrated: state}),
      watchers: {},
      lastKnownStates: {},
      isCheckingStates: false,
      algoPrice: null,
      isPriceFetching: false,
      addWatcherItem: (item: WatcherListItem) =>
        set(state => {
          if (state.watchers[item.address]) {
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

      fetchAlgoPrice: async () => {
        const state = get();
        if (state.isPriceFetching) return;

        set({isPriceFetching: true});
        try {
          const price = await fetchAlgoPrice();
          set({algoPrice: price});
        } catch (error) {
          console.error('Failed to fetch ALGO price:', error);
        } finally {
          set({isPriceFetching: false});
        }
      },

      checkStateChanges: async () => {
        const state = get();

        // Force reset if it's been stuck for more than 30 seconds
        if (state.isCheckingStates) {
          set({isCheckingStates: false});
          return; // Skip this check cycle to let state update
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
                const hasChanges = compareAccountStates(lastState, newState);

                if (hasChanges) {
                  // Show toast notification
                  useToastStore
                    .getState()
                    .showToast(
                      `State changed for ${formatWalletAddress(address)}`,
                      'info',
                    );
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
        } finally {
          set({isCheckingStates: false});
        }
      },

      startPeriodicCheck: () => {
        if (checkInterval) {
          return;
        }

        // Start immediate checks
        get().checkStateChanges();
        get().fetchAlgoPrice();

        // Set up periodic check every 60 seconds
        checkInterval = setInterval(() => {
          get().checkStateChanges();
          get().fetchAlgoPrice();
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
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

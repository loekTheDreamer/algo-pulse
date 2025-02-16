import {compareAccountStates} from '../utils/stateComparison';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {watchAddress} from '../api/api';
import {useToastStore} from './useToastStore';
import {formatWalletAddress} from '../utils/formatters';
import type {WatcherListItem, WatcherListStore} from '../types/watcherList';

let checkInterval: NodeJS.Timeout | null = null;

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({_hasHydrated: state}),
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
        console.log('state.isCheckingStates: ', state.isCheckingStates);

        // Force reset if it's been stuck for more than 30 seconds
        if (state.isCheckingStates) {
          console.log('Found isCheckingStates true, forcing reset');
          set({isCheckingStates: false});
          return; // Skip this check cycle to let state update
        }

        set({isCheckingStates: true});
        console.log('Set isCheckingStates to true, proceeding with check');
        try {
          console.log('Starting try block');
          const addresses = Object.keys(state.watchers);
          console.log('addresses', addresses);
          for (const address of addresses) {
            const response = await watchAddress(address);
            if (response.data) {
              const lastState = state.lastKnownStates[address];
              const newState = response.data;

              // Compare relevant state changes
              if (lastState) {
                const hasChanges = compareAccountStates(lastState, newState);

                if (hasChanges) {
                  console.log(`State changed for address: ${address}`);
                  // Show toast notification
                  useToastStore
                    .getState()
                    .showToast(
                      `Balance changed for ${formatWalletAddress(address)}`,
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
          console.log('Caught error in checkStateChanges');
          console.error('Error checking state changes:', error);
        } finally {
          console.log('In finally block, resetting isCheckingStates');
          set({isCheckingStates: false});
          console.log('isCheckingStates after reset:', get().isCheckingStates);
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
          console.log('Checking state changes...');
          get().checkStateChanges();
        }, 6000);
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

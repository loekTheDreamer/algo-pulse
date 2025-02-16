import type {AccountInfo} from '../api/api';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatcherListItem extends AccountInfo {
  dateAdded: string;
}

interface WatcherListStore {
  wactherList: WatcherListItem[];
  addWatcherItem: (item: AccountInfo) => void;
  removeWatcherItem: (item: WatcherListItem) => void;
  clearWatcherList: () => void;
}

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    set => ({
      wactherList: [],
      addWatcherItem: (item: AccountInfo) =>
        set(state => {
          // Check if item already exists in the list
          const exists = state.wactherList.some(
            existingItem => existingItem.address === item.address,
          );

          // Only add if it doesn't exist
          if (!exists) {
            return {
              wactherList: [
                ...state.wactherList,
                {
                  ...item,
                  dateAdded: new Date().toISOString(),
                },
              ],
            };
          } else {
            console.log('Item already exists');
          }

          // If item exists, return state unchanged
          return state;
        }),
      removeWatcherItem: (item: WatcherListItem) =>
        set(state => ({
          wactherList: state.wactherList.filter(
            i => i.address !== item.address,
          ),
        })),
      clearWatcherList: () => set(() => ({wactherList: []})),
    }),
    {
      name: 'watcher-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import type {AccountInfo} from '../api/api';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WatcherListStore {
  wactherList: AccountInfo[];
  addWatcherItem: (item: AccountInfo) => void;
  removeWatcherItem: (item: AccountInfo) => void;
  clearWatcherList: () => void;
}

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    set => ({
      wactherList: [],
      addWatcherItem: (item: AccountInfo) =>
        set(state => ({wactherList: [...state.wactherList, item]})),
      removeWatcherItem: (item: AccountInfo) =>
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

import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WatcherListStore {
  wactherList: string[];
  addWatcherItem: (item: string) => void;
  removeWatcherItem: (item: string) => void;
  clearWatcherList: () => void;
}

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    set => ({
      wactherList: [],
      addWatcherItem: (item: string) =>
        set(state => ({wactherList: [...state.wactherList, item]})),
      removeWatcherItem: (item: string) =>
        set(state => ({
          wactherList: state.wactherList.filter(i => i !== item),
        })),
      clearWatcherList: () => set(() => ({wactherList: []})),
    }),
    {
      name: 'watcher-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

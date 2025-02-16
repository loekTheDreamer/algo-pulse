import type {AccountInfo} from '../api/api';
import {create, StateCreator} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WatcherListItem extends AccountInfo {
  dateAdded: string;
}

interface WatcherListStore {
  watchers: Record<string, WatcherListItem>;
  addWatcherItem: (item: WatcherListItem) => void;
  removeWatcherItem: (item: WatcherListItem) => void;
  clearWatcherList: () => void;
  getWatcherList: () => WatcherListItem[];
}

export const useWatcherListStore = create<WatcherListStore>()(
  persist(
    (set, get) => ({
      watchers: {},
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
    }),
    {
      name: 'watcher-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

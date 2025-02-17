import {create} from 'zustand';
import type {WatcherListItem} from '@/types/watcherList';
import type {WatcherModal} from '@/types/watcherModal';

export const useWatcherModalStore = create<WatcherModal>()(set => ({
  visible: false,
  selectedWatcher: null,
  toggle: () => set(state => ({visible: !state.visible})),
  setSelectedWatcher: (selectedWatcher: WatcherListItem | null) =>
    set(() => ({selectedWatcher})),
}));

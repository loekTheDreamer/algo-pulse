import {WatcherListItem} from '@/types/watcherList';

export interface WatcherModal {
  visible: boolean;
  selectedWatcher: WatcherListItem | null;
  toggle: () => void;
  setSelectedWatcher: (watcher: WatcherListItem | null) => void;
}

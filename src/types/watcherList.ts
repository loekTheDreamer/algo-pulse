import type { AccountInfo } from './algorand';

export interface WatcherListItem extends AccountInfo {
  dateAdded: string;
}

export interface WatcherListStore {
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

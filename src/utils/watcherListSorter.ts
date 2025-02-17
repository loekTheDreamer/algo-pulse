import {WatcherListItem} from '@/types/watcherList';
import {FilterType} from '@components/ui/filterButtons/filterButtons';

export const getSortedWatcherList = (
  watcherList: WatcherListItem[],
  selectedFilter: FilterType,
): WatcherListItem[] => {
  if (!watcherList || watcherList.length === 0) {
    return [];
  }

  switch (selectedFilter) {
    case 'amount':
      return [...watcherList].sort((a, b) => {
        const aVal = Number(a.amount) * 1;
        const bVal = Number(b.amount) * 1;
        return bVal - aVal;
      });
    case 'calendar':
      return [...watcherList].sort(
        (a, b) =>
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
      );
    default:
      return watcherList;
  }
};

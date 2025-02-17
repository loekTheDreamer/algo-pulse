import type {WatcherListItem} from '@/types/watcherList';

import React from 'react';
import {
  Button,
  Divider,
  IconElement,
  List,
  ListItem,
} from '@ui-kitten/components';
import {Image} from 'react-native';
import {formatAlgoAmount, formatWalletAddress} from '@/utils/formatters';
import {useWatcherListStore} from '@store/useWatcherListStore';
import {TrashIcon} from '@components/icons/trashIcon/trashIcon';
import {useWatcherModalStore} from '@store/useWatcherModalStore';

import {useStyles} from './watcherList.useStyles';
import {FilterType} from '../filterButtons/filterButtons';

const renderSeparator = (): React.ReactElement => <Divider />;

interface WatcherListProps {
  selectedFilter: FilterType;
}

const WatcherList = ({
  selectedFilter,
}: WatcherListProps): React.ReactElement => {
  const {removeWatcherItem, getWatcherList, algoPrice, _hasHydrated} =
    useWatcherListStore();

  const getSortedWatcherList = () => {
    if (!_hasHydrated) {
      return [];
    }

    const watcherList = getWatcherList();

    if (!watcherList || watcherList.length === 0) {
      return [];
    }

    switch (selectedFilter) {
      case 'amount':
        const sorted = [...watcherList].sort((a, b) => {
          // Convert to numbers and multiply by 1 to ensure numeric values
          const aVal = Number(a.amount) * 1;
          const bVal = Number(b.amount) * 1;
          return bVal - aVal;
        });
        return sorted;
      case 'calendar':
        const calendarSorted = [...watcherList].sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
        );
        return calendarSorted;
      default:
        return watcherList;
    }
  };
  const styles = useStyles();
  const {toggle, setSelectedWatcher} = useWatcherModalStore();

  const renderItemAccessory = (item: WatcherListItem): React.ReactElement => (
    <Button
      size="tiny"
      appearance="ghost"
      status="danger"
      accessoryLeft={TrashIcon}
      onPress={() => removeWatcherItem(item)}
    />
  );

  const renderItemIcon = (item: WatcherListItem): IconElement => (
    <Image
      source={{uri: `https://robohash.org/${item.address}?set=set1&bgset=bg1`}}
      style={styles.icon}
    />
  );

  const handleItemPress = (item: WatcherListItem) => {
    setSelectedWatcher(item);
    toggle();
  };

  const renderListItem = ({
    item,
  }: {
    item: WatcherListItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      title={formatWalletAddress(item.address)}
      description={`${formatAlgoAmount(item.amount)} ALGO ≈ ${
        algoPrice
          ? `$${((item.amount / 1_000_000) * algoPrice).toFixed(2)}`
          : '...'
      }`}
      accessoryLeft={() => renderItemIcon(item)}
      accessoryRight={() => renderItemAccessory(item)}
      onPress={() => handleItemPress(item)}
    />
  );

  return (
    <List
      style={styles.container}
      data={getSortedWatcherList()}
      renderItem={renderListItem}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

export default WatcherList;

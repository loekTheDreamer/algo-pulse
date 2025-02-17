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

const renderSeparator = (): React.ReactElement => <Divider />;

interface WatcherListProps {
  selectedFilter: FilterType;
}

const WatcherList = ({
  selectedFilter,
}: WatcherListProps): React.ReactElement => {
  const {removeWatcherItem, getWatcherList, algoPrice} = useWatcherListStore();

  const getSortedWatcherList = () => {
    const list = getWatcherList();

    switch (selectedFilter) {
      case 'amount':
        return [...list].sort((a, b) => b.amount - a.amount);
      case 'trending':
        return [...list].sort((a, b) => {
          const aChanges = Object.keys(a.stateChanges || {}).length;
          const bChanges = Object.keys(b.stateChanges || {}).length;
          return bChanges - aChanges;
        });
      case 'date':
        return [...list].sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
      default:
        return list;
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
      description={`${formatAlgoAmount(item.amount)} ≈ ${
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

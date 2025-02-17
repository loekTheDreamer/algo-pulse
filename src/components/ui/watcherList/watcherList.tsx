import React from 'react';
import {Button, IconElement, List, ListItem} from '@ui-kitten/components';
import {StyleSheet, Image} from 'react-native';
import {formatWalletAddress} from '@/utils/formatters';
import {useWatcherListStore} from '@/store/useWatcherListStore';
import {usePeriodicCheck} from '@/hooks/usePeriodicCheck';
import type {WatcherListItem} from '@/types/watcherList';
import {TrashIcon} from '@/components/icons/trashIcon/trashIcon';

const WatcherList = (): React.ReactElement => {
  const {removeWatcherItem, getWatcherList} = useWatcherListStore();

  usePeriodicCheck();

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

  const renderItem = ({
    item,
  }: {
    item: WatcherListItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      title={formatWalletAddress(item.address)}
      description={item.amount + ' ALGO'}
      accessoryLeft={() => renderItemIcon(item)}
      accessoryRight={() => renderItemAccessory(item)}
    />
  );

  return (
    <List
      style={styles.container}
      data={getWatcherList()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default WatcherList;

import React from 'react';
import {
  Button,
  Icon,
  IconElement,
  List,
  ListItem,
  IconProps,
} from '@ui-kitten/components';
import {StyleSheet, Image} from 'react-native';
import {formatWalletAddress} from '@/utils/formatters';
import {useWatcherListStore} from '@/store/useWatcherListStore';
import type {WatcherListItem} from '@/types/watcherList';

const TrashIcon = (props: IconProps): IconElement => (
  <Icon {...props} name="trash-2" width={16} height={16} />
);

const WatcherList = (): React.ReactElement => {
  const {
    removeWatcherItem,
    getWatcherList,
    startPeriodicCheck,
    stopPeriodicCheck,
    _hasHydrated,
  } = useWatcherListStore();

  React.useEffect(() => {
    // const {_hasHydrated} = useWatcherListStore.getState();
    console.log('_hasHydrated: ', _hasHydrated);
    // Only start periodic check when component mounts and store is hydrated
    if (_hasHydrated) {
      startPeriodicCheck();

      // Clean up when component unmounts
      return () => {
        stopPeriodicCheck();
      };
    }
  }, [startPeriodicCheck, stopPeriodicCheck, _hasHydrated]);

  const renderItemAccessory = (item: WatcherListItem): React.ReactElement => (
    // <Icon {...props} name="trash-outline" />
    // <Button size="tiny"  >FOLLOW</Button>
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
      description={item.amount}
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
    maxHeight: 192,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default WatcherList;

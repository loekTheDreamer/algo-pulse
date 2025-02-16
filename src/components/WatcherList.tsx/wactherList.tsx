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
import {formatWalletAddress} from '../../utils/formatters';
import {useWatcherListStore} from '../../store/useWatcherListStore';
import {AccountInfo} from '../../api/api';
import {WatcherListItem} from '../../store/useWatcherListStore';

const TrashIcon = (props: IconProps): IconElement => (
  <Icon {...props} name="trash-2" width={16} height={16} />
);

const WatcherList = (): React.ReactElement => {
  const {watchers, addWatcherItem, removeWatcherItem, clearWatcherList, getWatcherList} =
    useWatcherListStore();

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
      style={{width: 30, height: 30}}
    />
  );

  const renderItem = ({
    item,
    index,
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
    <List style={styles.container} data={getWatcherList()} renderItem={renderItem} />
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 192,
  },
});

export default WatcherList;

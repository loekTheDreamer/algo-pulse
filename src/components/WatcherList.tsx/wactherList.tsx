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

const TrashIcon = (props: IconProps): IconElement => (
  <Icon {...props} name="trash-2" width={16} height={16} />
);

const WatcherList = (): React.ReactElement => {
  const {wactherList, addWatcherItem, removeWatcherItem, clearWatcherList} =
    useWatcherListStore();

  const renderItemAccessory = (item: AccountInfo): React.ReactElement => (
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

  const renderItemIcon = (item: AccountInfo): IconElement => (
    <Image
      source={{uri: `https://robohash.org/${item.address}?set=set1&bgset=bg1`}}
      style={{width: 30, height: 30}}
    />
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: AccountInfo;
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
    <List style={styles.container} data={wactherList} renderItem={renderItem} />
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 192,
  },
});

export default WatcherList;

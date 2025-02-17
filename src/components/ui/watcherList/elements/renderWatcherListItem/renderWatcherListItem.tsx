import React from 'react';
import {Button, IconElement, ListItem} from '@ui-kitten/components';
import {Image} from 'react-native';
import {useWatcherModalStore} from '@/store/useWatcherModalStore';
import {useWatcherListStore} from '@/store/useWatcherListStore';
import {TrashIcon} from '@/components/icons/trashIcon/trashIcon';
import {formatWalletAddress} from '@/utils/formatters';
import type {WatcherListItem} from '@/types/watcherList';
import {useStyles} from './renderWatcherListItem.useStyles';

interface Props {
  item: WatcherListItem;
}

const RenderWatcherListItem = ({item}: Props): React.ReactElement => {
  const {toggle, setSelectedWatcher} = useWatcherModalStore();
  const {removeWatcherItem} = useWatcherListStore();
  const styles = useStyles();

  const handleItemPress = () => {
    setSelectedWatcher(item);
    toggle();
  };

  const renderItemAccessory = (): React.ReactElement => (
    <Button
      size="tiny"
      appearance="ghost"
      status="danger"
      accessoryLeft={TrashIcon}
      onPress={() => removeWatcherItem(item)}
    />
  );

  const renderItemIcon = (): IconElement => (
    <Image
      source={{uri: `https://robohash.org/${item.address}?set=set1&bgset=bg1`}}
      style={styles.icon}
    />
  );

  return (
    <ListItem
      title={formatWalletAddress(item.address)}
      description={item.amount + ' ALGO'}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
      onPress={handleItemPress}
    />
  );
};

export default RenderWatcherListItem;

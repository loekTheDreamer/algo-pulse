import type {WatcherListItem} from '@/types/watcherList';

import React from 'react';
import {Image} from 'react-native';
import {Button, IconElement, ListItem} from '@ui-kitten/components';

import {TrashIcon} from '@/components/icons/trashIcon/trashIcon';
import {formatWalletAddress} from '@/utils/formatters';
import {useWatcherModalStore} from '@/store/useWatcherModalStore';

import {useStyles} from './renderWatcherListItem.useStyles';

interface RenderListItemProps {
  item: WatcherListItem;
  index: number;
  removeWatcherItem: (item: WatcherListItem) => void;
}

export const RenderWatcherListItem = ({
  item,
  removeWatcherItem,
}: RenderListItemProps): React.ReactElement => {
  const {toggle, setSelectedWatcher} = useWatcherModalStore();
  const styles = useStyles();

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

  const handleItemPress = () => {
    setSelectedWatcher(item);
    toggle();
  };

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

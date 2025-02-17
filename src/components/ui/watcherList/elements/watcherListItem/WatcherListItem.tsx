import React from 'react';
import {Button, IconElement, ListItem} from '@ui-kitten/components';
import {Image} from 'react-native';
import {formatWalletAddress} from '@/utils/formatters';
import type {WatcherListItem as WatcherListItemType} from '@/types/watcherList';
import {TrashIcon} from '@/components/icons/trashIcon/trashIcon';

import {useStyles} from './WatcherListItem.useStyles';

interface WatcherListItemProps {
  item: WatcherListItemType;
  onPress: (item: WatcherListItemType) => void;
  onRemove: (item: WatcherListItemType) => void;
}

export const WatcherListItem = ({
  item,
  onPress,
  onRemove,
}: WatcherListItemProps): React.ReactElement => {
  const styles = useStyles();

  const renderItemAccessory = (): React.ReactElement => (
    <Button
      size="tiny"
      appearance="ghost"
      status="danger"
      accessoryLeft={TrashIcon}
      onPress={() => onRemove(item)}
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
      onPress={() => onPress(item)}
    />
  );
};

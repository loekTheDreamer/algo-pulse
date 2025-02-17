import type {WatcherListItem} from '@/types/watcherList';

import React, {useState} from 'react';
import {
  Button,
  Divider,
  IconElement,
  Input,
  Layout,
  List,
  ListItem,
} from '@ui-kitten/components';
import {Image, Keyboard} from 'react-native';
import {watchAddress} from '@api/api';
import {formatAlgoAmount, formatWalletAddress} from '@/utils/formatters';
import {useWatcherListStore} from '@store/useWatcherListStore';
import {usePeriodicCheck} from '@hooks/usePeriodicCheck';
import {TrashIcon} from '@components/icons/trashIcon/trashIcon';
import {SendIcon} from '@components/icons/sendIcon/sendIcon';

import {useStyles} from './WatcherList.useStyles';
import {useToastStore} from '@store/useToastStore';
import {useWatcherModalStore} from '@store/useWatcherModalStore';

const renderSeparator = (): React.ReactElement => <Divider />;

const WatcherList = (): React.ReactElement => {
  const {watchers, addWatcherItem, algoPrice} = useWatcherListStore();

  const {removeWatcherItem, getWatcherList} = useWatcherListStore();
  const [value, setValue] = useState('');

  usePeriodicCheck();
  const styles = useStyles();
  const {showToast} = useToastStore();
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
  //≈
  const renderListItem = ({
    item,
  }: {
    item: WatcherListItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      title={formatWalletAddress(item.address)}
      description={`${formatAlgoAmount(item.amount)} ≈ ${
        algoPrice ? `$${(item.amount * algoPrice).toFixed(2)}` : '...'
      }`}
      accessoryLeft={() => renderItemIcon(item)}
      accessoryRight={() => renderItemAccessory(item)}
      onPress={() => handleItemPress(item)}
    />
  );

  const handleAddWatcher = async () => {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
      return;
    }

    if (watchers[trimmedValue]) {
      showToast('This address is already being watched', 'error');
      return;
    }
    try {
      const watching = await watchAddress(trimmedValue);
      if (watching.data) {
        addWatcherItem({
          ...watching.data,
          dateAdded: new Date().toISOString(),
        });
        showToast('Address added to watchlist', 'success');
      }
      if (watching.error) {
        showToast(watching.error, 'error');
      }
    } catch (error) {
      showToast('Error adding address to watchlist', 'error');
    } finally {
      setValue('');
      Keyboard.dismiss();
    }
  };

  const renderInputAccessory = (): React.ReactElement => (
    <Button
      size="tiny"
      appearance="ghost"
      status="danger"
      accessoryLeft={SendIcon}
      onPress={handleAddWatcher}
    />
  );

  return (
    <Layout style={styles.container} level="2">
      <Image style={styles.logo} source={require('@/assets/logo/logo.png')} />
      <Layout style={styles.contentContainer} level="2">
        <Layout style={styles.listCard} level="3">
          <List
            style={styles.container}
            data={getWatcherList()}
            renderItem={renderListItem}
            ItemSeparatorComponent={renderSeparator}
          />
        </Layout>
        <Layout style={styles.inputCard} level="4">
          <Input
            placeholder="Add Algorand address to start watching..."
            size="small"
            value={value}
            onChangeText={nextValue => setValue(nextValue)}
            onSubmitEditing={handleAddWatcher}
            accessoryRight={renderInputAccessory}
          />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default WatcherList;

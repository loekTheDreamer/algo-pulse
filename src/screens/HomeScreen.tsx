import type {WatcherListItem} from '@/types/watcherList';

import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, Keyboard} from 'react-native';
import {Button, Input, Layout} from '@ui-kitten/components';

import {useWatcherListStore} from '@store/useWatcherListStore';
import WatcherList from '@/components/ui/watcherList/WatcherList';
import {watchAddress} from '@api/api';
import {useToastStore} from '@store/useToastStore';
import {SendIcon} from '@/components/icons/sendIcon/sendIcon';

import {useStyles} from './HomeScreen.useStyles';
import {WatcherModal} from '@/components/ui/watcherModal/WatcherModal';

export const HomeScreen = (): React.ReactElement => {
  const {watchers, addWatcherItem} = useWatcherListStore();
  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWatcher, setSelectedWatcher] =
    useState<WatcherListItem | null>(null);

  const {showToast} = useToastStore();
  const styles = useStyles();

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

  const renderItemAccessory = (): React.ReactElement => (
    <Button
      size="tiny"
      appearance="ghost"
      status="danger"
      accessoryLeft={SendIcon}
      onPress={handleAddWatcher}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Layout style={styles.container} level="2">
        <Image style={styles.logo} source={require('@/assets/logo/logo.png')} />
        <Layout style={styles.contentContainer} level="2">
          <Layout style={styles.listCard} level="3">
            <WatcherList
              onItemPress={item => {
                setSelectedWatcher(item);
                setModalVisible(true);
              }}
            />
          </Layout>
          <Layout style={styles.inputCard} level="4">
            <Input
              placeholder="Add Algorand address to start watching..."
              size="small"
              value={value}
              onChangeText={nextValue => setValue(nextValue)}
              onSubmitEditing={handleAddWatcher}
              accessoryRight={renderItemAccessory}
            />
          </Layout>
        </Layout>
      </Layout>
      <WatcherModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        watcher={selectedWatcher}
      />
    </KeyboardAvoidingView>
  );
};

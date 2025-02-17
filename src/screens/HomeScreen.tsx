import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Input, Layout} from '@ui-kitten/components';

import {useWatcherListStore} from '@store/useWatcherListStore';
import WatcherList from '@/components/ui/watcherList/watcherList';
import {watchAddress} from '@api/api';
import {useToastStore} from '@store/useToastStore';

export const HomeScreen = (): React.ReactElement => {
  const {watchers, addWatcherItem} = useWatcherListStore();
  const [value, setValue] = useState('');
  const {showToast} = useToastStore();

  const handleAddWatcher = async () => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      showToast('Please enter an Algorand address', 'error');
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
        setValue('');
      }
    } catch (error) {
      console.error('Error watching address:', error);
      showToast('Error adding address to watchlist', 'error');
    }
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.contentContainer} level="1">
        <Layout style={styles.card} level="3">
          <Input
            placeholder="Add Algorand address to start watching..."
            value={value}
            onChangeText={nextValue => setValue(nextValue)}
            onSubmitEditing={handleAddWatcher}
            // accessoryRight={renderIcon}
          />
        </Layout>
        <Layout style={styles.card} level="2">
          <WatcherList />
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  watcherListContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

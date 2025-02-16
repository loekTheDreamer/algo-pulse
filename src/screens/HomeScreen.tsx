import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {useWatcherListStore} from '../store/useWatcherListStore';
import WatcherList from '../components/WatcherList.tsx/wactherList';
import {watchAddress} from '../api/api';

export const HomeScreen = (): React.ReactElement => {
  const {wactherList, addWatcherItem, removeWatcherItem, clearWatcherList} =
    useWatcherListStore();
  const [value, setValue] = useState('');

  useEffect(() => {
    console.log(wactherList);
  }, [wactherList]);

  const handleAddWatcher = async () => {
    try {
      const watching = await watchAddress(value.trim());
      console.log('watching', watching);
      addWatcherItem(watching.data!);
    } catch (error) {
      console.error('Error watching address:', error);
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
          />
        </Layout>
        <Layout style={styles.card} level="2">
          <WatcherList />
        </Layout>
      </Layout>
    </Layout>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   layout: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

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

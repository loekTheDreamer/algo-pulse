import React, {useState} from 'react';
import {Divider, Input, Layout, List} from '@ui-kitten/components';
import {Image, Keyboard} from 'react-native';

import {watchAddress} from '@api/api';
import {useWatcherListStore} from '@/store/useWatcherListStore';
import {usePeriodicCheck} from '@/hooks/usePeriodicCheck';
import {useToastStore} from '@/store/useToastStore';

import RenderWatcherListItem from './elements/RenderWatcherListItem/RenderWatcherListItem';
import renderWatcherInputAccessory from './elements/renderWatcherInputAccessory/renderWatcherInputAccessory';
import {useStyles} from './watcherList.useStyles';

const renderSeparator = (): React.ReactElement => <Divider />;

const WatcherList = (): React.ReactElement => {
  const {watchers, addWatcherItem} = useWatcherListStore();
  const {getWatcherList} = useWatcherListStore();
  const [value, setValue] = useState('');

  usePeriodicCheck();
  const styles = useStyles();
  const {showToast} = useToastStore();

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

  return (
    <Layout style={styles.container} level="2">
      <Image style={styles.logo} source={require('@/assets/logo/logo.png')} />
      <Layout style={styles.contentContainer} level="2">
        <Layout style={styles.listCard} level="3">
          <List
            style={styles.container}
            data={getWatcherList()}
            renderItem={({item}) => <RenderWatcherListItem item={item} />}
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
            accessoryRight={() =>
              renderWatcherInputAccessory({handleAddWatcher})
            }
          />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default WatcherList;

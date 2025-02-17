import React, {useState} from 'react';
import {Button, Input, Layout} from '@ui-kitten/components';
import {Image, Keyboard} from 'react-native';
import {watchAddress} from '@api/api';
import {useWatcherListStore} from '@store/useWatcherListStore';
import {usePeriodicCheck} from '@hooks/usePeriodicCheck';
import {SendIcon} from '@components/icons/sendIcon/sendIcon';
import WatcherList from '@components/ui/watcherList/watcherList';
import FilterButtons, {
  FilterType,
} from '@components/ui/filterButtons/filterButtons';

import {useStyles} from './watcherContainer.useStyles';
import {useToastStore} from '@store/useToastStore';

const WatcherContainer = (): React.ReactElement => {
  const {watchers, addWatcherItem} = useWatcherListStore();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('amount');
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

  const renderInputAccessory = (): React.ReactElement => (
    <Button
      size="tiny"
      appearance="ghost"
      status="primary"
      accessoryLeft={SendIcon}
      onPress={handleAddWatcher}
    />
  );

  return (
    <>
      <Image style={styles.logo} source={require('@/assets/logo/logo.png')} />
      <Layout style={styles.container} level="2">
        <Layout style={styles.contentContainer} level="2">
          <FilterButtons
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <Layout style={styles.listCard} level="3">
            <WatcherList selectedFilter={selectedFilter} />
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
    </>
  );
};

export default WatcherContainer;

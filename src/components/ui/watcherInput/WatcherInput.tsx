import React, {useState} from 'react';
import {Button, Input, Layout} from '@ui-kitten/components';
import {Keyboard} from 'react-native';
import {watchAddress} from '@api/api';
import {useWatcherListStore} from '@store/useWatcherListStore';
import {SendIcon} from '@components/icons/sendIcon/sendIcon';
import {useToastStore} from '@store/useToastStore';

import {useStyles} from './watcherInput.useStyles';

const WatcherInput = (): React.ReactElement => {
  const {watchers, addWatcherItem} = useWatcherListStore();
  const [value, setValue] = useState('');
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
  );
};

export default WatcherInput;

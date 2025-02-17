import React from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';

import WatcherList from '@/components/ui/watcherList/WatcherList';

import {useStyles} from './HomeScreen.useStyles';
import {WatcherModal} from '@/components/ui/watcherModal/WatcherModal';

export const HomeScreen = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <WatcherList />
      <WatcherModal />
    </KeyboardAvoidingView>
  );
};

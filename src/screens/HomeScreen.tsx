import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import WatcherContainer from '@/components/ui/watcherContainer/watcherContainer';

import {useStyles} from './HomeScreen.useStyles';
import {WatcherModal} from '@/components/ui/watcherModal/WatcherModal';

export const HomeScreen = (): React.ReactElement => {
  const styles = useStyles();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <WatcherContainer />
        <WatcherModal />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

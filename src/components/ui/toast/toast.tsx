import React from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

import {useToastAnimation} from '@hooks/useToastAnimation';

export const Toast = (): React.ReactElement | null => {
  const {fadeAnim, message, visible, type} = useToastAnimation();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Layout style={[styles.content, styles[type]]}>
        <Text style={styles.message}>{message}</Text>
      </Layout>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#F44336',
  },
  info: {
    backgroundColor: '#2196F3',
  },
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  content: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    flex: 1,
  },
});

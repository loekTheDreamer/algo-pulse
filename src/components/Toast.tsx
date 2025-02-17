import React, {useEffect} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import {useToastStore} from '@store/useToastStore';

export const Toast = (): React.ReactElement | null => {
  const {message, type, visible} = useToastStore();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) {
    return null;
  }

  const backgroundColor = {
    success: '#4CAF50',
    error: '#F44336',
    info: '#2196F3',
  }[type];

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Layout style={[styles.content, {backgroundColor}]}>
        <Text style={styles.message}>{message}</Text>
      </Layout>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  content: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    flex: 1,
  },
});

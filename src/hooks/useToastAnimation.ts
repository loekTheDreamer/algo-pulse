import {useEffect, useRef} from 'react';
import {Animated} from 'react-native';

import {useToastStore} from '@store/useToastStore';

export const useToastAnimation = () => {
  const {message, type, visible} = useToastStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  return {
    fadeAnim,
    message,
    visible,
    type,
  };
};

import {StyleSheet} from 'react-native';

export const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    icon: {
      width: 30,
      height: 30,
      borderRadius: 4,
      overflow: 'hidden',
    },
  });
};

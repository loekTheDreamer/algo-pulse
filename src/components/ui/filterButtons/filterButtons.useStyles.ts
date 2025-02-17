import {StyleSheet} from 'react-native';

export const useStyles = () => {
  return StyleSheet.create({
    buttonGroup: {
      borderRadius: 8,
      alignSelf: 'flex-end',
      width: 40,
      height: 40,
      padding: 0,
    },
    icon: {
      width: 18,
      height: 18,
    },
  });
};

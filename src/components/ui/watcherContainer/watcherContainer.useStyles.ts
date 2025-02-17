import {StyleSheet} from 'react-native';
import {useTheme} from '@ui-kitten/components';

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
      paddingBottom: 0,
    },
    listCard: {
      flex: 1,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    inputCard: {
      padding: 16,
      borderRadius: 8,
      marginTop: 'auto',
    },
    logo: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginVertical: 20,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme['color-basic-transparent-focus-border'],
    },

  });
};

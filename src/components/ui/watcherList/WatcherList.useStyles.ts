import {StyleSheet} from 'react-native';
import {useTheme} from '@ui-kitten/components';

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    watcherListContainer: {
      padding: 16,
      paddingBottom: 0,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
      paddingBottom: 0,
    },
    card: {
      padding: 16,
      borderRadius: 8,
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
    button: {
      marginVertical: 8,
    },
    layout: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    modalContainer: {
      minHeight: 192,
    },
  });
};

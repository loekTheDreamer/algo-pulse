import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Layout, Text} from '@ui-kitten/components';
import {useWatcherListStore} from '../store/useWatcherListStore';

export const HomeScreen = (): React.ReactElement => {
  const {wactherList, addWatcherItem, removeWatcherItem, clearWatcherList} =
    useWatcherListStore();
  const [counter, setCounter] = React.useState(0);

  useEffect(() => {
    console.log(wactherList);
  }, [wactherList]);

  return (
    <Layout style={styles.container} level="1">
      {/* This inner Layout will have a different shade */}
      <Layout style={styles.card} level="2">
        <Text category="h6">Counter Demo</Text>
        <Button style={styles.button} onPress={() => addWatcherItem('hello')}>
          BUTTON
        </Button>
        <Button
          style={styles.button}
          onPress={() => removeWatcherItem('hello')}>
          BUTTON
        </Button>
        <Text>{`Pressed ${counter} times`}</Text>
      </Layout>

      {/* This Layout will have yet another shade */}
      <Layout style={styles.card} level="3">
        <Text category="h6">Another Section</Text>
        <Text>Notice the different background shade</Text>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
});

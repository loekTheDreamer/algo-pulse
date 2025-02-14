import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Button, Layout, Text} from '@ui-kitten/components';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [counter, setCounter] = React.useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Layout style={styles.container} level="1">
            <Button onPress={() => setCounter(counter + 1)}>BUTTON</Button>

            <Text style={styles.text}>{`Pressed ${counter} times`}</Text>
          </Layout>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 8,
  },
});

export default App;

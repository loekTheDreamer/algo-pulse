import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {HomeScreen} from './src/screens/HomeScreen';
import { Toast } from './src/components/Toast';

export default (): React.ReactElement => {
  const colorScheme = useColorScheme();

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={colorScheme === 'dark' ? eva.dark : eva.light}>
        <Layout style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <HomeScreen />
          </SafeAreaView>
          <Toast />
        </Layout>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

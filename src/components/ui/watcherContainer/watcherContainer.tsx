import React, {useState} from 'react';
import {Layout} from '@ui-kitten/components';
import {Image} from 'react-native';
import {usePeriodicCheck} from '@hooks/usePeriodicCheck';
import WatcherList from '@components/ui/watcherList/watcherList';
import FilterButtons, {
  FilterType,
} from '@components/ui/filterButtons/filterButtons';
import WatcherInput from '@components/ui/watcherInput/WatcherInput';

import {useStyles} from './watcherContainer.useStyles';

const WatcherContainer = (): React.ReactElement => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('amount');
  usePeriodicCheck();
  const styles = useStyles();

  return (
    <>
      <Image style={styles.logo} source={require('@/assets/logo/logo.png')} />
      <Layout style={styles.container} level="2">
        <Layout style={styles.contentContainer} level="2">
          <FilterButtons
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <Layout style={styles.listCard} level="3">
            <WatcherList selectedFilter={selectedFilter} />
          </Layout>
          <WatcherInput />
        </Layout>
      </Layout>
    </>
  );
};

export default WatcherContainer;

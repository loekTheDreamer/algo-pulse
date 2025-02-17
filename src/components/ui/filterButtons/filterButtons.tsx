import React from 'react';
import {Button, ButtonGroup} from '@ui-kitten/components';
import {
  TrendingIcon,
  DownloadIcon,
  CalendarIcon,
} from '@components/icons/filterIcons/filterIcons';

import {useStyles} from './filterButtons.useStyles';

export type FilterType = 'trending' | 'downloaded' | 'calendar';

interface FilterButtonsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButtons = ({
  selectedFilter,
  onFilterChange,
}: FilterButtonsProps): React.ReactElement => {
  const styles = useStyles();

  return (
    <ButtonGroup size="small" style={styles.buttonGroup}>
      <Button
        accessoryLeft={TrendingIcon}
        onPress={() => onFilterChange('trending')}
        status={selectedFilter === 'trending' ? 'primary' : 'basic'}
      />
      <Button
        accessoryLeft={DownloadIcon}
        onPress={() => onFilterChange('downloaded')}
        status={selectedFilter === 'downloaded' ? 'primary' : 'basic'}
      />
      <Button
        accessoryLeft={CalendarIcon}
        onPress={() => onFilterChange('calendar')}
        status={selectedFilter === 'calendar' ? 'primary' : 'basic'}
      />
    </ButtonGroup>
  );
};

export default FilterButtons;

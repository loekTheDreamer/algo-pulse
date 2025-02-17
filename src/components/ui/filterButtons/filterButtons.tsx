import React from 'react';
import {Button} from '@ui-kitten/components';
import {
  TrendingIcon,
  CalendarIcon,
} from '@components/icons/filterIcons/filterIcons';

import {useStyles} from './filterButtons.useStyles';

export type FilterType = 'amount' | 'calendar';

interface FilterButtonsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButtons = ({
  selectedFilter,
  onFilterChange,
}: FilterButtonsProps): React.ReactElement => {
  const styles = useStyles();

  const handleToggle = () => {
    onFilterChange(selectedFilter === 'amount' ? 'calendar' : 'amount');
  };

  const renderIcon = (props: any) => {
    const IconComponent =
      selectedFilter === 'amount' ? TrendingIcon : CalendarIcon;
    return (
      <IconComponent
        {...props}
        style={[props.style, styles.icon]}
      />
    );
  };

  return (
    <Button
      size="tiny"
      style={styles.buttonGroup}
      appearance="ghost"
      status="primary"
      accessoryLeft={renderIcon}
      onPress={handleToggle}
    />
  );
};

export default FilterButtons;

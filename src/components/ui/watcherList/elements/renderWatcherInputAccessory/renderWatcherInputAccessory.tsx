import React from 'react';
import {Button} from '@ui-kitten/components';
import {SendIcon} from '@/components/icons/sendIcon/sendIcon';

interface RenderWatcherInputAccessoryProps {
  handleAddWatcher: () => void;
}

const renderWatcherInputAccessory = ({
  handleAddWatcher,
}: RenderWatcherInputAccessoryProps): React.ReactElement => {
  return (
    <Button
      size="tiny"
      appearance="ghost"
      status="primary"
      accessoryLeft={SendIcon}
      onPress={handleAddWatcher}
    />
  );
};

export default renderWatcherInputAccessory;

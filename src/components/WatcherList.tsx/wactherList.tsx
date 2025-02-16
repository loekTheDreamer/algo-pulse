import React from 'react';
import {
  Button,
  Icon,
  IconElement,
  List,
  ListItem,
  IconProps,
} from '@ui-kitten/components';
import {StyleSheet, Image} from 'react-native';
import {formatWalletAddress} from '../../utils/formatters';

interface IListItem {
  title: string;
  description: string;
}

const data = new Array(8).fill({
  title: 'J25ABPMWJLJECPMGWWM42BAG6BGILFY3VL732IAKP2YPCLURIE26LV6XYE',
  description: 'Description for Item',
});

const TrashIcon = (props: IconProps): IconElement => (
  <Icon {...props} name="trash-2" width={16} height={16} />
);

const WatcherList = (): React.ReactElement => {
  const renderItemAccessory = (props: IconProps): React.ReactElement => (
    // <Icon {...props} name="trash-outline" />
    // <Button size="tiny"  >FOLLOW</Button>
    <Button
      size="tiny"
      appearance="ghost"
      status="danger"
      accessoryLeft={TrashIcon}
    />
  );

  const renderItemIcon = (props: IconProps): IconElement => (
    <Image
      source={{uri: `https://robohash.org/${'luke'}?set=set1&bgset=bg1`}}
      style={{width: 30, height: 30}}
    />
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: IListItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      title={formatWalletAddress(item.title)}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );

  return <List style={styles.container} data={data} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 192,
  },
});

export default WatcherList;

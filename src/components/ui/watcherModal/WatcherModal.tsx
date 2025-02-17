import React from 'react';
import {Modal, Pressable, StyleSheet} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';

import {useWatcherModalStore} from '@/store/useWatcherModalStore';

export const WatcherModal = (): React.ReactElement => {
  const {visible, toggle, selectedWatcher} = useWatcherModalStore();
  return (
    <Modal visible={visible} transparent={true} onRequestClose={toggle}>
      <Pressable style={styles.modalOverlay} onPress={toggle}>
        <Pressable>
          <Card style={styles.modalCard} disabled={true}>
            <Text category="h6" style={styles.title}>
              Wallet Details
            </Text>
            {selectedWatcher && (
              <>
                <Text>Address: {selectedWatcher.address}</Text>
                <Text>Amount: {selectedWatcher.amount} ALGO</Text>
                <Text>
                  Added:{' '}
                  {new Date(selectedWatcher.dateAdded).toLocaleDateString()}
                </Text>
              </>
            )}
            <Button style={styles.closeButton} onPress={toggle}>
              CLOSE
            </Button>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    margin: 20,
    minWidth: 300,
  },
  title: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
  },
});

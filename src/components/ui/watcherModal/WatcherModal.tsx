import React from 'react';
import {Modal, Pressable, StyleSheet} from 'react-native';
import {Button, Card, Text} from '@ui-kitten/components';
import type {WatcherListItem} from '@/types/watcherList';

interface WatcherModalProps {
  visible: boolean;
  onClose: () => void;
  watcher: WatcherListItem | null;
}

export const WatcherModal = ({
  visible,
  onClose,
  watcher,
}: WatcherModalProps): React.ReactElement => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}>
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}>
        <Pressable>
          <Card
            style={styles.modalCard}
            disabled={true}>
            <Text category="h6" style={styles.title}>
              Wallet Details
            </Text>
            {watcher && (
              <>
                <Text>Address: {watcher.address}</Text>
                <Text>Amount: {watcher.amount} ALGO</Text>
                <Text>
                  Added:{' '}
                  {new Date(watcher.dateAdded).toLocaleDateString()}
                </Text>
              </>
            )}
            <Button
              style={styles.closeButton}
              onPress={onClose}>
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

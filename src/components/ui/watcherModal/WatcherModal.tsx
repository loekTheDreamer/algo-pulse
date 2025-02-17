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
                <Text category="s1" style={styles.fieldTitle}>
                  Basic Information
                </Text>
                <Text>Address: {selectedWatcher.address}</Text>
                <Text>Balance: {selectedWatcher.amount} ALGO</Text>
                <Text>
                  Pending Rewards: {selectedWatcher['pending-rewards']}
                  microALGO
                </Text>
                <Text>Total Rewards: {selectedWatcher.rewards} microALGO</Text>
                <Text>
                  Minimum Balance: {selectedWatcher['min-balance']} microALGO
                </Text>

                <Text
                  category="s1"
                  style={[styles.fieldTitle, styles.sectionSpace]}>
                  Assets & Applications
                </Text>
                <Text>
                  Total Assets: {selectedWatcher['total-assets-opted-in']}
                </Text>
                <Text>
                  Created Assets: {selectedWatcher['total-created-assets']}
                </Text>
                <Text>
                  Total Apps: {selectedWatcher['total-apps-opted-in']}
                </Text>
                <Text>
                  Created Apps: {selectedWatcher['total-created-apps']}
                </Text>

                <Text
                  category="s1"
                  style={[styles.fieldTitle, styles.sectionSpace]}>
                  Other Details
                </Text>
                <Text>Status: {selectedWatcher.status}</Text>
                <Text>Round: {selectedWatcher.round}</Text>
                <Text>
                  Added:{' '}
                  {new Date(selectedWatcher.dateAdded).toLocaleDateString()}
                </Text>
                <Button style={styles.closeButton} onPress={toggle}>
                  CLOSE
                </Button>
              </>
            )}
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
    maxHeight: '92%',
  },
  title: {
    marginBottom: 15,
  },
  fieldTitle: {
    marginTop: 5,
    marginBottom: 5,
    color: '#8F9BB3',
  },
  sectionSpace: {
    marginTop: 15,
  },
  closeButton: {
    marginTop: 15,
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import ArrowLeft from '../assets/icons/arrow-left-icon.svg';
import PlusIcon from '../assets/icons/plus-icon.svg';
import { modalservices } from '../data/ModalServices';
const { width, height } = Dimensions.get('window');

export default function PlusModal({ plusModal, setPlusModal, style }) {
  const [selectedService, setSelectedService] = useState(null);

  const closeModal = () => {
    setPlusModal(false);
    setSelectedService(null);
  };

  return (
    <View style={[styles.plusContainer, style]}>
      <TouchableOpacity
        onPress={() => {
          setPlusModal(!plusModal);
        }}
        style={styles.plusInnerContainer}>
        <PlusIcon style={styles.plus} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={plusModal}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalHeaderIcon}>
                <ArrowLeft style={styles.arrowLeft} />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>
                What Are You Looking For?
              </Text>
            </View>
            <FlatList
              data={modalservices}
              numColumns={2}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.serviceItem]}>
                  <Image source={item.icon} style={styles.serviceIcon} />
                  <Text style={styles.serviceText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  plusContainer: {
    backgroundColor: '#1C4837',
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.45,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plusInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  plus: {
    width: 15,
    height: 15,
    color: '#fff'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 20,
    height: height / 1.25,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
    marginBottom: 28,
  },
  modalHeaderIcon: {
    position: 'absolute',
    left: 26,
  },
  modalHeaderTitle: {
    fontSize: 16,
    color: '#000',
  },
  serviceItem: {
    alignItems: 'center',
    width: width / 2.15,
    marginBottom: 50,
  },

  serviceIcon: {
    width: 50,
    height: 50,
  },
  serviceText: {
    marginTop: 16,
    textAlign: 'center',
  },
  arrowLeft: {
    width: 24.19,
    height: 19.83,
  },
})

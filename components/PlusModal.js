import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { modalservices } from '../data/ModalServices';
import Modal from '../components/Modal';
const { width, height } = Dimensions.get('window');
import styles from '../Styles';

export default function PlusModal({ visible, onClose, navigation }) {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <Modal visible={visible} onClose={onClose} style={stylesPlus} modalTopNav
      modalTopNavChildren={
        <>
          <Text style={styles.topBarTitle}>
            What Are You Looking For?
          </Text>
        </>
      }
    >
      <View style={stylesPlus.modalContainer}>
        <FlatList
          data={modalservices}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[stylesPlus.serviceItem]}>
              <Image source={item.icon} style={stylesPlus.serviceIcon} />
              <Text style={stylesPlus.serviceText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const stylesPlus = StyleSheet.create({
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

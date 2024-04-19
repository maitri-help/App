import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
} from 'react-native';
import { modalservices } from '../data/ModalServices';
import Modal from '../components/Modal';
import styles from '../Styles';

export default function PlusModal({ visible, onClose, navigation }) {
  const [selectedService, setSelectedService] = useState(null);

  const [pressedItem, setPressedItem] = useState(null);

  const handlePressIn = (itemId) => {
    setPressedItem(itemId);
  };

  const handlePressOut = () => {
    setPressedItem(null);
  };

  return (
    <Modal visible={visible} onClose={onClose} style={stylesPlus} modalTopNav
      modalTopNavChildren={
        <>
          <Text style={[styles.topBarTitle, stylesPlus.topBarTitle]}>
            What Are You Looking For?
          </Text>
        </>
      }
    >
      <FlatList
        style={stylesPlus.servicesListWrapper}
        contentContainerStyle={stylesPlus.servicesListContent}
        data={modalservices}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={stylesPlus.columnWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                stylesPlus.serviceItem,
                pressedItem === item.id && stylesPlus.serviceItemPressed,
              ]}
              onPressIn={() => handlePressIn(item.id)}
              onPressOut={handlePressOut}
            >
              <Image source={item.icon} style={stylesPlus.serviceIcon} />
              <Text
                style={[
                  stylesPlus.serviceText,
                  pressedItem === item.id && stylesPlus.serviceTextPressed,
                ]}
              >{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </Modal>
  );
};

const stylesPlus = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
  servicesListWrapper: {
    flex: 1,
  },
  servicesListContent: {
    justifyContent: 'center',
    gap: 25,
    paddingHorizontal: 16,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  serviceItem: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1 / 1,
    borderRadius: 70,
    padding: 13,
  },
  serviceItemPressed: {
    backgroundColor: '#E3E3E3',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  serviceText: {
    color: '#000',
    fontFamily: 'poppins-regular',
    fontSize: 13,
    lineHeight: 15,
    textAlign: 'center',
    paddingBottom: 5,
  },
  serviceTextPressed: {
    fontFamily: 'poppins-semibold',
  },
  topBarTitle: {
    textAlign: 'center',
    flex: 1,
  },
  backLinkInline: {
    position: 'absolute',
    left: 25,
    zIndex: 2,
  }
})

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Modal from '../components/Modal';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import styles from '../Styles';
import EmojiSelector, { Categories } from "react-native-emoji-selector";


export default function EmojiPickerModal({ visible, onClose, onEmojiSelect, selectedEmoji }) {

  const [pressedItem, setPressedItem] = useState(null);

  const handlePress = (emoji) => {
    setPressedItem(emoji);
    onEmojiSelect(emoji);
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      style={stylesEP}
    >
      <View style={styles.modalTopNav}>
        <TouchableOpacity onPress={onClose} style={[styles.backLink, styles.backLinkCustom]}>
          <ArrowLeftIcon style={styles.backLinkIcon} />
        </TouchableOpacity>

        <Text style={[styles.topBarTitle, stylesEP.topBarTitle]}>
          Select Your Emoji
        </Text>
      </View>
      <View style={stylesEP.selectedEmojiWrapper}>
        <View style={stylesEP.selectedEmojiItem}>
            <Text style={stylesEP.selectedEmojiText}>{pressedItem}</Text>
        </View>
      </View>
      <EmojiSelector
        category={Categories.symbols}
        onEmojiSelected={emoji => handlePress(emoji)}
      />
    </Modal>
  )
}

const stylesEP = StyleSheet.create({
  modalContainer: {
    height: '90%',
  },
  topBarTitle: {
    paddingLeft: 40,
    flex: 1,
  },
  colorListWrapper: {
    flex: 1,
  },
  colorListContent: {
    justifyContent: 'center',
    gap: 20,
    padding: 16,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  selectedEmojiWrapper: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 90,
  },
  selectedEmojiItem: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#000',
  },
  selectedEmojiText: {
    fontSize: 50, // adjust the size as needed
    textAlign: 'center', // center the text horizontally
    lineHeight: 120, // center the text vertically. This should be approximately the same as the height of the container (selectedEmojiItem)
  },
  colorItem: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 85,
    height: 85,
    borderRadius: 50,
    shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.6)' : '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

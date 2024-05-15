import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Platform } from 'react-native';
import Modal from '../components/Modal';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import styles from '../Styles';
import { updateUser } from '../hooks/api';
import { checkAuthentication, getAccessToken } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';

export default function ColorPickerModal({ visible, onClose, onColorSelect, selectedColor }) {
  const colors = ['#A3C0FC', '#AC7AFC', '#9EDE73', '#6CD3CE', '#FF9A00', '#FF4E92'];
  const [userId, setUserId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await checkAuthentication();
        if (userData) {
          setUserId(userData.userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePress = async (color) => {
    onColorSelect(color);

    try {
      const accessToken = await getAccessToken();
      const userDataToUpdate = {
        color: color
      };
      await updateUser(userId, userDataToUpdate, accessToken);
      toast.show('Color changed successfully', { type: 'success' });
      console.log('User color updated successfully');
    } catch (error) {
      toast.show('Unsuccessful color change', { type: 'error' });
      console.error('Error updating user color:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      style={stylesColor}
    >
      <View style={styles.modalTopNav}>
        <TouchableOpacity onPress={onClose} style={[styles.backLink, styles.backLinkCustom]}>
          <ArrowLeftIcon style={styles.backLinkIcon} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, stylesColor.topBarTitle]}>
          Select Your Color
        </Text>
      </View>
      <View style={stylesColor.selectedColorWrapper}>
        {selectedColor && (
          <View style={[stylesColor.selectedColorItem, { backgroundColor: selectedColor }]} />
        )}
      </View>
      <FlatList
        style={stylesColor.colorListWrapper}
        contentContainerStyle={stylesColor.colorListContent}
        data={colors}
        numColumns={3}
        keyExtractor={(color) => color}
        renderItem={({ item: color }) => (
          <View style={stylesColor.columnWrapper}>
            <TouchableOpacity
              onPress={() => handlePress(color)}
              activeOpacity={1}
            >
              <View style={[stylesColor.colorItem, { backgroundColor: color }]} />
            </TouchableOpacity>
          </View>

        )}
      />
    </Modal>
  )
}

const stylesColor = StyleSheet.create({
  modalContainer: {
    height: '85%',
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
  selectedColorWrapper: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 90,
  },
  selectedColorItem: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#000',
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

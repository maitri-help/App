import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Modal from '../../components/Modal';
import styles from '../../Styles';

export default function DeleteModal({ visible, onClose, deleteAccount }) {

  const handleDelete = () => {
    deleteAccount();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      modalTopNav={true}
      modalTopNavChildren={
        <Text style={styles.topBarTitle}>
          Are you sure you want to delete your account?
        </Text>
      }
      style={stylesProfile}
    >
      <View style={[styles.contentContainer, stylesProfile.container]}>
        <View style={stylesProfile.notice}>
          <Text style={stylesProfile.noticeText}>Clicking Delete Account will permanently delete your account and all information related to it.</Text>
          <Text style={stylesProfile.noticeText}>This action can't be undone.</Text>
        </View>
        <View style={stylesProfile.buttons}>
          <TouchableOpacity style={[stylesProfile.button, stylesProfile.logoutButton]} onPress={handleDelete}>
            <Text style={[stylesProfile.buttonText, stylesProfile.logoutButtonText]}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[stylesProfile.button, stylesProfile.cancelButton]} onPress={onClose}>
            <Text style={[stylesProfile.buttonText, stylesProfile.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal >
  );
};

const stylesProfile = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
  container: {
    flex: 1,
  },
  buttons: {
    paddingTop: 50,
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 295,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#4D4D4D',
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'poppins-medium',
    lineHeight: 18,
    color: '#737373'
  },
  cancelButton: {
    backgroundColor: '#E5F5E3'
  },
  notice: {
    paddingVertical: 30,
    gap: 20,
    maxWidth: 250,
    alignSelf: 'center'
  },
  noticeText: {
    color: '#FF7070',
    fontSize: 14,
    fontFamily: 'poppins-medium',
    lineHeight: 18,
  }
})

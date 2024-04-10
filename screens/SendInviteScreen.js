import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from '../compontents/Modal';

export default function SendInviteScreen({ visible, onClose, navigation }) {
    return (
        <Modal visible={visible} onClose={onClose} style={stylesInvite} modalTopNav modalTopNavTitle={'Grow your tribe'}>

        </Modal >
    );
}

const stylesInvite = StyleSheet.create({
    modalContainer: {
        height: '80%',
    },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Modal from '../compontents/Modal';

export default function SendInviteScreen({ visible, onClose, navigation }) {
    return (
        <Modal visible={visible} onClose={onClose} style={stylesInvite}>
            <TouchableOpacity onPress={onClose} style={styles.backLink}>
                <ArrowLeftIcon style={styles.backLinkIcon} />
            </TouchableOpacity>
        </Modal >
    );
}

const stylesInvite = StyleSheet.create({
    modalContainer: {
        height: '80%',
    },
});
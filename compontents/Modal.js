import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import styles from '../Styles';

export default function ModalComponent({ visible, onClose, modalTopNav, modalTopNavLink, modalTopNavTitle, children, style }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[stylesModal.modal, style && style.modal]}>
                <TouchableOpacity
                    style={stylesModal.overlayTouchable}
                    onPress={onClose}
                />
                <View style={[stylesModal.modalContainer, style && style.modalContainer]}>
                    <View style={[stylesModal.modalContent, style && style.modalContent]}>
                        {modalTopNav &&
                            <View style={stylesModal.modalTopNav}>
                                <TouchableOpacity onPress={modalTopNavLink || onClose} style={styles.backLinkInline}>
                                    <ArrowLeftIcon style={styles.backLinkIcon} />
                                </TouchableOpacity>
                                <Text style={styles.topBarTitle}>
                                    {modalTopNavTitle}
                                </Text>
                            </View>
                        }
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const stylesModal = StyleSheet.create({
    modal: {
        flex: 1,
    },
    modalContainer: {
        width: '100%',
        height: '66%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalContent: {
        flex: 1,
    },
    overlayTouchable: {
        flex: 1,
    },
});
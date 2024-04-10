import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export default function ModalComponent({ visible, onClose, children, style }) {
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
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';

export default function ThankYouScreen({ visible, onClose, setAlmostThereModalVisible }) {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modal}>
                <TouchableOpacity
                    style={styles.overlayTouchable}
                    onPress={onClose}
                />
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={[styles.container, stylesThankYou.container]}>
                            <TouchableOpacity onPress={() => {
                                onClose();
                                setAlmostThereModalVisible(true);
                            }} style={styles.backLink} >
                                <ArrowLeftIcon style={styles.backLinkIcon} />
                            </TouchableOpacity>
                            <View style={[styles.topTextsContainer, stylesThankYou.textsContainer]}>
                                <Text style={[styles.title, stylesThankYou.title]}>Thank you for your interest in Maitri </Text>
                                <Text style={[styles.text, stylesThankYou.text, stylesThankYou.textMedium]}>At the moment, we're all about catering to individuals experiencing situations of need.</Text>
                                <Text style={[styles.text, stylesThankYou.text]}>If you were invited to join a support circle, use your code to get started</Text>
                            </View>
                            <Image source={require('../assets/img/flower-illustration.png')} style={stylesThankYou.img} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const stylesThankYou = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
    textMedium: {
        fontWeight: '500',
        fontFamily: 'poppins-medium',
    },
    textsContainer: {
        gap: 20,
        marginBottom: 30,
    },
    img: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
    }
});

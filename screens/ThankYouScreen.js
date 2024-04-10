import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Modal from '../compontents/Modal';

export default function ThankYouScreen({ visible, onClose, setAlmostThereModalVisible }) {

    return (
        <Modal visible={visible} onClose={onClose}>
            <TouchableOpacity onPress={() => {
                onClose();
                setAlmostThereModalVisible(true);
            }} style={styles.backLink} >
                <ArrowLeftIcon style={styles.backLinkIcon} />
            </TouchableOpacity>
            <View style={[styles.container, stylesThankYou.container]}>
                <View style={[styles.topTextsContainer, stylesThankYou.textsContainer]}>
                    <Text style={[styles.title, stylesThankYou.title]}>Thank you for your interest in Maitri </Text>
                    <Text style={[styles.text, stylesThankYou.text, stylesThankYou.textMedium]}>At the moment, we're all about catering to individuals experiencing situations of need.</Text>
                    <Text style={[styles.text, stylesThankYou.text]}>If you were invited to join a support circle, use your code to get started</Text>
                </View>
                <Image source={require('../assets/img/flower-illustration.png')} style={stylesThankYou.img} />
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

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';

export default function ThankYouScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, styles.authContainer]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
                    <ArrowLeftIcon width={20} height={20} color={'#000'} />
                </TouchableOpacity>
                <View style={[styles.topTextsContainer, stylesThankYou.textsContainer]}>
                    <Text style={[styles.title, stylesThankYou.title]}>Thank you for your interest in Maitri </Text>
                    <Text style={[styles.text, stylesThankYou.text, stylesThankYou.textMedium]}>At the moment, we're all about catering to individuals experiencing situations of need.</Text>
                    <Text style={[styles.text, stylesThankYou.text]}>If you were invited to join a support circle, use your code to get started</Text>
                </View>
                <Image source={require('../assets/img/flower-illustration.png')} style={stylesThankYou.img} />
            </View>
        </SafeAreaView>
    );
}

const stylesThankYou = StyleSheet.create({
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
        marginBottom: 60,
    },
    img: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    }
});

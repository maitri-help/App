import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../Styles';

export default function LoginScreen() {
    return (
        <View style={[styles.container, stylesLogin.container]}>
            <View style={stylesLogin.topTextsContainer}>
                <Text style={[styles.title, stylesLogin.title]}>Welcome Back!</Text>
                <Text style={[styles.text, stylesLogin.text]}>Login to your Maitri account</Text>
            </View>
        </View>
    );
}

const stylesLogin = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingHorizontal: 40,
        paddingTop: 80,
        paddingBottom: 40,
    },
    topTextsContainer: {
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
});
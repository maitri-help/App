import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import styles from '../Styles';

export default function LoginScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Identify');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={stylesSuccess.illustrationWrapper}>
                    <Image source={require('../assets/img/mimi-illustration.png')} style={stylesSuccess.illustration} />
                </View>
                <View style={styles.textsWrapper}>
                    <Text style={[styles.title, stylesSuccess.title]}>Success!</Text>
                    <Text style={[styles.text, stylesSuccess.text]}>Your Maitri account has been verified.</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const stylesSuccess = StyleSheet.create({
    illustrationWrapper: {
        marginBottom: 10,
    },
    illustration: {
        resizeMode: 'contain',
        width: 140,
        height: 140,
    },
    textsWrapper: {
        alignItems: 'center',
        gap: 5,
    },
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
});
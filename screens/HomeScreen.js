import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../compontents/Button';
import styles from '../Styles';
import Logo from '../assets/img/maitri-logo.svg';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={stylesHome.homeContainer}>
                <Logo width={90} height={90} />
                <View style={styles.buttonContainer}>
                    <AppButton
                        onPress={() => navigation.navigate('Assignments')}
                        title="See assignments"
                    />
                </View>
            </View>
        </View>
    );
}

const stylesHome = StyleSheet.create({
    homeContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        fontSize: 14,
        fontWeight: '400',
    },
});
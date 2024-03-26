import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/img/maitri-logo.svg';

export default function CirclesScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={stylesCircles.circlesContainer}>
                <Logo width={90} height={90} />
            </View>
        </View>
    );
}

const stylesCircles = StyleSheet.create({
    circlesContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        fontSize: 14,
        fontWeight: '400',
    },
});
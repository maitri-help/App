import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/img/maitri-logo.svg';

export default function ProfileScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={stylesProfile.profileContainer}>
                <Logo width={90} height={90} />
            </View>
        </View>
    );
}

const stylesProfile = StyleSheet.create({
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        fontSize: 14,
        fontWeight: '400',
    },
});
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import BellIcon from '../assets/icons/bell-icon.svg';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <Text style={stylesHome.greetingsText}>Good morning Ben!</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={stylesHome.bellWrapper}>
                    <BellIcon style={stylesHome.bellIcon} />
                    <View style={stylesHome.indicator}></View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const stylesHome = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
    },
    bellWrapper: {
        position: 'relative',
    },
    bellIcon: {
        width: 20,
        height: 20,
        color: '#000',
    },
    indicator: {
        backgroundColor: '#E91145',
        width: 8,
        height: 8,
        borderRadius: '50%',
        position: 'absolute',
        bottom: 1,
        right: -4,
    }
});
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/img/maitri-logo.svg';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';

export default function NotificationsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, styles.topBarBack]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLinkInline}>
                    <ArrowLeftIcon width={20} height={20} color={'#000'} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Notifications</Text>
            </View>
            <View style={styles.container}>
                <View style={stylesNotifications.notificationsContainer}>
                    <Logo width={90} height={90} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const stylesNotifications = StyleSheet.create({
    notificationsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
    },
});
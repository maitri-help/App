import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Notification from '../compontents/Notification';

export default function PendingRequestScreen({ navigation }) {
    const notificationsPending = [
        { id: 1, assignee: 'Rachel Green', image: require('../assets/emojis/victory-icon.png') },
        { id: 2, assignee: 'Phoebe Buffay', image: require('../assets/emojis/victory-icon.png') },
        { id: 3, assignee: 'Gunther', image: require('../assets/emojis/victory-icon.png') },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, styles.topBarBack]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLinkInline}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Pending requests</Text>
            </View>
            <ScrollView contentContainerStyle={stylesNotifications.notificationsContainer}>
                <View style={[stylesNotifications.notificationsGroup, styles.contentContainer, { borderBottomWidth: 0 }]}>
                    <View style={stylesNotifications.notificationsGroupList}>
                        {notificationsPending.map(notification => (
                            <Notification key={notification.id} assignee={notification.assignee} title={notification.title} time={notification.time} image={notification.image} buttons />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const stylesNotifications = StyleSheet.create({
    notificationsContainer: {
        flexDirection: 'column',
        gap: 20,
        paddingVertical: 25,
    },
    notificationsGroup: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    notificationsGroupList: {
        flexDirection: 'column',
        gap: 10,
    },
    notificationsGroupTitle: {
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    notificationsGroupTitleText: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'poppins-semibold',
        lineHeight: 18,
    },
    notificationsGroupLink: {
        marginTop: 10,
        paddingVertical: 10,
        marginBottom: -15,
    },
    notificationsGroupLinkText: {
        textAlign: 'center',
        color: '#000',
        fontSize: 15,
        fontFamily: 'poppins-semibold',
        lineHeight: 18,
    }
});
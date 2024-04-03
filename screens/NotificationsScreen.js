import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Notification from '../compontents/Notification';

export default function NotificationsScreen({ navigation }) {
    const notifications = [
        { id: 1, assignee: 'Monica Geller', title: `assigned to take out the dog`, time: '2 min ago', image: require('../assets/emojis/dog-icon.png') },
        { id: 2, assignee: ['Chandler Bing', 'Rachel Green'], title: `can't take out the dog`, time: 'Tomorrow, 10:00-11:00 am', image: require('../assets/emojis/dog-icon.png') },
        { id: 3, assignee: 'Joey Tribbiani', title: 'assigned to ride to the hospital', time: '3 days ago', image: require('../assets/emojis/car-icon.png') },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, styles.topBarBack]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLinkInline}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Notifications</Text>
            </View>
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={stylesNotifications.notificationsContainer}>
                    <View style={stylesNotifications.notificationsGroup}>
                        <View style={stylesNotifications.notificationsGroupTitle}>
                            <Text style={stylesNotifications.notificationsGroupTitleText}>New</Text>
                        </View>
                        <View style={stylesNotifications.notificationsGroupList}>
                            {notifications.map(notification => (
                                <Notification key={notification.id} assignee={notification.assignee} title={notification.title} time={notification.time} image={notification.image} />
                            ))}
                        </View>
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const stylesNotifications = StyleSheet.create({
    notificationsContainer: {
        flexDirection: 'column',
        gap: 20,
        paddingVertical: 30,
    },
    notificationsGroup: {
        
    },
    notificationsGroupList: {
        flexDirection: 'column',
    },
    notificationsGroupTitleText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-semibold',
        lineHeight: 16,
    }
});
import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation, UIManager } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Notification from '../components/Notification';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function NotificationsScreen({ navigation }) {
    const notificationsNew = [
        { id: 1, assignee: 'Monica Geller', title: `assigned to take out the dog`, time: '2 min ago', emoji: '🐶' },
        { id: 2, assignee: 'Chandler Bing', title: `can't take out the dog`, time: '4 hours ago', emoji: '🐶' },
        { id: 3, assignee: 'Joey Tribbiani', title: 'assigned to ride to the hospital', time: '3 days ago', emoji: '🚙' },
    ];

    const notificationsPending = [
        { id: 1, assignee: 'Rachel Green', title: `wants to join your circle`, time: '2 min ago', emoji: '✌️' },
        { id: 2, assignee: 'Phoebe Buffay', title: `wants to join your circle`, time: '4 hours ago', emoji: '✌️' },
        { id: 2, assignee: 'Gunther', title: `wants to join your circle`, time: '5 hours ago', emoji: '✌️' },
    ];

    const notificationsEarlier = [
        { id: 1, assignee: 'Ross Geller', title: `completed hospital Ride`, time: '4 days ago', emoji: '🚙' },
        { id: 2, assignee: 'Phoebe Buffay', title: `assigned to take out the dog`, time: '5 days ago', emoji: '🐶' },
        { id: 3, assignee: 'Phoebe Buffay', title: `assigned to take out the dog`, time: '6 days ago', emoji: '🐶' },
        { id: 4, assignee: 'Phoebe Buffay', title: `assigned to take out the dog`, time: '7 days ago', emoji: '🐶' },
        { id: 5, assignee: 'Phoebe Buffay', title: `assigned to take out the dog`, time: '8 days ago', emoji: '🐶' },
    ];

    const [showAllEarlier, setShowAllEarlier] = useState(false);
    const [listHeight, setListHeight] = useState(null);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [showAllEarlier]);

    const handleToggleShowAllEarlier = () => {
        setShowAllEarlier(!showAllEarlier);
    };

    const handleListLayout = ({ nativeEvent }) => {
        setListHeight(nativeEvent.layout.height);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, styles.topBarBack]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLinkInline}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Notifications</Text>
            </View>
            <ScrollView contentContainerStyle={stylesNotifications.notificationsContainer}>
                <View style={[styles.contentContainer, stylesNotifications.notificationsGroup]}>
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text style={stylesNotifications.notificationsGroupTitleText}>New</Text>
                    </View>
                    <View style={stylesNotifications.notificationsGroupList}>
                        {notificationsNew.map(notification => (
                            <Notification key={notification.id} assignee={notification.assignee} title={notification.title} time={notification.time} emoji={notification.emoji} />
                        ))}
                    </View>
                </View>
                <View style={[stylesNotifications.notificationsGroup, styles.contentContainer]}>
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text style={stylesNotifications.notificationsGroupTitleText}>Pending Requests</Text>
                    </View>
                    <View style={{ overflow: 'hidden', marginBottom: 10 }}>
                        <View style={stylesNotifications.notificationsGroupList}>
                            {notificationsPending.map((notification, index) => (
                                index < 2 ?
                                    <Notification key={notification.id} assignee={notification.assignee} title={notification.title} time={notification.time} emoji={notification.emoji} buttons />
                                    : null
                            ))}
                        </View>
                    </View>
                    {notificationsPending.length > 2 && (
                        <TouchableOpacity style={stylesNotifications.notificationsGroupLink} onPress={() => navigation.navigate('PendingRequest')}>
                            <Text style={stylesNotifications.notificationsGroupLinkText}>See all</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={[styles.contentContainer, stylesNotifications.notificationsGroup, { borderBottomWidth: 0 }]}>
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text style={stylesNotifications.notificationsGroupTitleText}>Earlier</Text>
                    </View>
                    <View style={{ overflow: 'hidden', marginBottom: 10, height: showAllEarlier ? 'auto' : listHeight }}>
                        <View onLayout={handleListLayout} style={stylesNotifications.notificationsGroupList}>
                            {notificationsEarlier.map((notification, index) => (
                                index < 2 || showAllEarlier ?
                                    <Notification key={notification.id} assignee={notification.assignee} title={notification.title} time={notification.time} emoji={notification.emoji} />
                                    : null
                            ))}
                        </View>
                    </View>
                    {notificationsEarlier.length > 2 && (
                        <TouchableOpacity onPress={handleToggleShowAllEarlier} style={stylesNotifications.notificationsGroupLink}>
                            <Text style={stylesNotifications.notificationsGroupLinkText}>
                                {showAllEarlier ? 'See less notifications' : 'See previous notifications'}
                            </Text>
                        </TouchableOpacity>
                    )}
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
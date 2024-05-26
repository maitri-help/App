import React, { useState, useEffect } from 'react';
import { Platform, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation, UIManager } from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Notification from '../components/Notification';
import { getNotificationsForUser, markAsRead } from '../hooks/api';
import { checkAuthentication } from '../authStorage';
import moment from 'moment';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function NotificationsScreen({ navigation }) {
    const [notificationsNew, setNotificationsNew] = useState([]);
    const [notificationsPending, setNotificationsPending] = useState([]);
    const [notificationsEarlier, setNotificationsEarlier] = useState([]);
    const [showAllEarlier, setShowAllEarlier] = useState(false);
    const [listHeight, setListHeight] = useState(null);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [showAllEarlier]);

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    const accessToken = userData.accessToken;
                    const userId = userData.userId;

                    const response = await getNotificationsForUser(userId, accessToken);
                    const notifications = response.data;

                    const newNotifications = notifications.filter(notification => !notification.isRead && notification.type !== 'Pending Request');
                    const pendingNotifications = notifications.filter(notification => notification.type === 'Pending Request');
                    const earlierNotifications = notifications.filter(notification => notification.isRead && notification.type !== 'Pending Request');

                    setNotificationsNew(newNotifications);
                    setNotificationsPending(pendingNotifications);
                    setNotificationsEarlier(earlierNotifications);

                    // Mark new notifications as read
                    newNotifications.forEach(notification => {
                        markAsRead(notification.notificationId, accessToken);
                    });
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }

        fetchNotifications();
    }, []);

    const handleToggleShowAllEarlier = () => {
        setShowAllEarlier(!showAllEarlier);
    };

    const handleListLayout = ({ nativeEvent }) => {
        setListHeight(nativeEvent.layout.height);
    };

    const formatTimeAgo = (dateTime) => {
        return moment(dateTime).fromNow();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, styles.topBarBack]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLinkInline}>
                    <ArrowLeftIcon width={18} height={18} style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Notifications</Text>
            </View>
            <ScrollView contentContainerStyle={stylesNotifications.notificationsContainer}>
                <View style={[styles.contentContainer, stylesNotifications.notificationsGroup]}>
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text style={stylesNotifications.notificationsGroupTitleText}>New</Text>
                    </View>
                    <View style={stylesNotifications.notificationsGroupList}>
                        {notificationsNew.length > 0 ?
                            notificationsNew.map(notification => (
                                <Notification
                                    key={notification.notificationId}
                                    assignee={`User ${notification.userId}`} // Replace with actual assignee if available
                                    title={notification.message}
                                    time={formatTimeAgo(notification.dateTime)}
                                    emoji={'🔔'} // Replace with appropriate emoji
                                />
                            ))
                            : (
                                <View style={stylesNotifications.notificationsGroupEmpty}>
                                    <Text style={stylesNotifications.notificationsGroupEmptyText}>No new notifications</Text>
                                </View>
                            )}
                    </View>
                </View>
                <View style={[stylesNotifications.notificationsGroup, styles.contentContainer]}>
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text style={stylesNotifications.notificationsGroupTitleText}>Pending Requests</Text>
                    </View>
                    <View style={{ overflow: 'hidden', marginBottom: 10 }}>
                        <View style={stylesNotifications.notificationsGroupList}>
                            {notificationsPending.length > 0 ?
                                notificationsPending.map((notification, index) => (
                                    index < 2 ?
                                        <Notification
                                            key={notification.notificationId}
                                            assignee={`User ${notification.userId}`} // Replace with actual assignee if available
                                            title={notification.message}
                                            time={formatTimeAgo(notification.dateTime)}
                                            emoji={'✌️'} // Replace with appropriate emoji
                                            buttons
                                        />
                                        : null
                                ))
                                : (
                                    <View style={stylesNotifications.notificationsGroupEmpty}>
                                        <Text style={stylesNotifications.notificationsGroupEmptyText}>No pending requests</Text>
                                    </View>
                                )}
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
                            {notificationsEarlier.length > 0 ?
                                notificationsEarlier.map((notification, index) => (
                                    index < 2 || showAllEarlier ?
                                        <Notification
                                            key={notification.notificationId}
                                            assignee={`User ${notification.userId}`} // Replace with actual assignee if available
                                            title={notification.message}
                                            time={formatTimeAgo(notification.dateTime)}
                                            emoji={'🔔'} // Replace with appropriate emoji
                                        />
                                        : null
                                ))
                                : (
                                    <View style={stylesNotifications.notificationsGroupEmpty}>
                                        <Text style={stylesNotifications.notificationsGroupEmptyText}>No older notifications</Text>
                                    </View>
                                )}
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
    },
    notificationsGroupEmpty: {
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    notificationsGroupEmptyText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    }
});

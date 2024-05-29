import React, { useState, useEffect } from 'react';
import {
    Platform,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    UIManager
} from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Notification from '../components/Notification';
import { getAccessToken, checkAuthentication } from '../authStorage';
import {
    getNotificationsForUser,
    markAsRead,
    changeUserCircle
} from '../hooks/api';
import { formatDistanceToNow } from 'date-fns';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function NotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);
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

                    const response = await getNotificationsForUser(
                        userId,
                        accessToken
                    );
                    setNotifications(response.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        }

        fetchNotifications();
    }, []);

    const handleAccept = async (notification, circleName) => {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                const accessToken = userData.accessToken;

                await changeUserCircle(
                    notification.userId,
                    notification.triggeredByUserId,
                    circleName,
                    accessToken
                );
                await markAsRead(notification.notificationId, accessToken);
                setNotifications(
                    notifications.filter(
                        (n) => n.notificationId !== notification.notificationId
                    )
                );
            }
        } catch (error) {
            console.error('Error accepting request:', error.response.data);
        }
    };

    const handleToggleShowAllEarlier = () => {
        setShowAllEarlier(!showAllEarlier);
    };

    const handleListLayout = ({ nativeEvent }) => {
        setListHeight(nativeEvent.layout.height);
    };

    const renderNotifications = (filterFn, type) => {
        const filteredNotifications = notifications.filter(filterFn);

        if (filteredNotifications.length === 0) {
            return (
                <View style={stylesNotifications.notificationsGroupEmpty}>
                    <Text
                        style={stylesNotifications.notificationsGroupEmptyText}
                    >
                        {type === 'new' && 'No new notifications'}
                        {type === 'pending' && 'No pending requests'}
                        {type === 'earlier' && 'No older notifications'}
                    </Text>
                </View>
            );
        }

        return filteredNotifications.map((notification, index) => (
            <Notification
                key={notification.notificationId}
                title={notification.message}
                assignee={notification.triggeredByUserName}
                time={formatDistanceToNow(new Date(notification.dateTime))}
                emoji={
                    notification.taskCategory === 'dog'
                        ? '🐶'
                        : notification.taskCategory === 'car'
                        ? '🚙'
                        : '✌️'
                }
                buttons={type === 'pending'}
                onAccept={(circleName) =>
                    handleAccept(notification, circleName)
                }
            />
        ));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, styles.topBarBack]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backLinkInline}
                >
                    <ArrowLeftIcon
                        width={18}
                        height={18}
                        style={styles.backLinkIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Notifications</Text>
            </View>
            <ScrollView
                contentContainerStyle={
                    stylesNotifications.notificationsContainer
                }
            >
                <View
                    style={[
                        styles.contentContainer,
                        stylesNotifications.notificationsGroup
                    ]}
                >
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text
                            style={
                                stylesNotifications.notificationsGroupTitleText
                            }
                        >
                            New
                        </Text>
                    </View>
                    <View style={stylesNotifications.notificationsGroupList}>
                        {renderNotifications(
                            (n) => !n.isRead && n.type !== 'pending_request',
                            'new'
                        )}
                    </View>
                </View>
                <View
                    style={[
                        stylesNotifications.notificationsGroup,
                        styles.contentContainer
                    ]}
                >
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text
                            style={
                                stylesNotifications.notificationsGroupTitleText
                            }
                        >
                            Pending Requests
                        </Text>
                    </View>
                    <View style={{ overflow: 'hidden', marginBottom: 10 }}>
                        <View
                            style={stylesNotifications.notificationsGroupList}
                        >
                            {renderNotifications(
                                (n) =>
                                    n.type === 'pending_request' && !n.isRead,
                                'pending'
                            )}
                        </View>
                    </View>
                </View>
                <View
                    style={[
                        styles.contentContainer,
                        stylesNotifications.notificationsGroup,
                        { borderBottomWidth: 0 }
                    ]}
                >
                    <View style={stylesNotifications.notificationsGroupTitle}>
                        <Text
                            style={
                                stylesNotifications.notificationsGroupTitleText
                            }
                        >
                            Earlier
                        </Text>
                    </View>
                    <View
                        style={{
                            overflow: 'hidden',
                            marginBottom: 10,
                            height: showAllEarlier ? 'auto' : listHeight
                        }}
                    >
                        <View
                            onLayout={handleListLayout}
                            style={stylesNotifications.notificationsGroupList}
                        >
                            {renderNotifications((n) => n.isRead, 'earlier')}
                        </View>
                    </View>
                    {notifications.filter((n) => n.isRead).length > 2 && (
                        <TouchableOpacity
                            onPress={handleToggleShowAllEarlier}
                            style={stylesNotifications.notificationsGroupLink}
                        >
                            <Text
                                style={
                                    stylesNotifications.notificationsGroupLinkText
                                }
                            >
                                {showAllEarlier
                                    ? 'See less notifications'
                                    : 'See previous notifications'}
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
        paddingVertical: 25
    },
    notificationsGroup: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5'
    },
    notificationsGroupList: {
        flexDirection: 'column',
        gap: 10
    },
    notificationsGroupTitle: {
        marginBottom: 10,
        paddingHorizontal: 5
    },
    notificationsGroupTitleText: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'poppins-semibold',
        lineHeight: 18
    },
    notificationsGroupLink: {
        marginTop: 10,
        paddingVertical: 10,
        marginBottom: -15
    },
    notificationsGroupLinkText: {
        textAlign: 'center',
        color: '#000',
        fontSize: 15,
        fontFamily: 'poppins-semibold',
        lineHeight: 18
    },
    notificationsGroupEmpty: {
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    notificationsGroupEmptyText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18
    }
});

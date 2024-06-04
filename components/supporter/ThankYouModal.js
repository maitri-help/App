import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomBox from '../CustomBox';
import { checkAuthentication } from '../../authStorage';
import { markAsRead } from '../../hooks/api';

export default function ThankYouModal({
    visible,
    setVisible,
    thankYouNotifications = [],
    setThankYouNotifications
}) {
    const [notificationsToShow, setNotificationsToShow] = React.useState(
        thankYouNotifications
    );

    const handleMarkAsRead = async (notificationId) => {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                const accessToken = userData.accessToken;
                const response = await markAsRead(notificationId, accessToken);
            }
        } catch (error) {
            console.error(
                'Error marking notification as read:',
                error.response.data
            );
        }
    };

    const handleCardClick = async () => {
        const notification = notificationsToShow[0];
        if (notificationsToShow.length > 1) {
            const filteredNotifications = notificationsToShow.filter(
                (item) => item.notificationId !== notification.notificationId
            );
            setNotificationsToShow(filteredNotifications);
            setThankYouNotifications(filteredNotifications);
        } else {
            setNotificationsToShow([]);
            setThankYouNotifications([]);
        }
        await handleMarkAsRead(notification.notificationId);
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <TouchableOpacity
                onPress={() => {
                    if (notificationsToShow.length === 1) {
                        setVisible(false);
                    }
                    handleCardClick();
                }}
                style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        maxHeight: 200
                    }}
                >
                    {notificationsToShow.length > 0 && (
                        <CustomBox
                            title={`${notificationsToShow[0].message} `}
                            largerText="You Are The Best!"
                            bgColor="#FFE8D7"
                            bgImgColor="#FFD8BC"
                            containerStyle={{ marginHorizontal: 0 }}
                            onlyTextsStyle={{ maxWidth: 140, marginBottom: 0 }}
                        />
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

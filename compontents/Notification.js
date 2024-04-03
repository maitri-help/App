import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function Notification({ title, assignee, time, image }) {

    return (
        <TouchableOpacity style={stylesNotification.NotificationContainer}>
            <View style={stylesNotification.NotificationImageWrapper}>
                <Image source={image} style={stylesNotification.NotificationImage} />
            </View>
            <View style={stylesNotification.NotificationInfoContainer}>
                <Text style={stylesNotification.NotificationTitle}>{assignee} {title}</Text>
                <Text style={stylesNotification.NotificationTime}>{time}</Text>
            </View>
        </TouchableOpacity>
    );
};

const stylesNotification = StyleSheet.create({
    NotificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 15,
    },
    NotificationImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    NotificationImage: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    NotificationInfoContainer: {
        flexShrink: 1,
        gap: 3,
    },
    NotificationTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2,
    },
    NotificationTime: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 14,
    }
});
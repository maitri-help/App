import React, { useState } from 'react';
import { Platform, View, Text, TouchableOpacity, LayoutAnimation, StyleSheet, UIManager } from "react-native";

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function Notification({ title, assignee, time, emoji, buttons, onAccept }) {
    const [infoVisible, setInfoVisible] = useState(false);

    const toggleInfoVisibility = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInfoVisible(!infoVisible);
    };

    const circles = [
        { name: 'First' },
        { name: 'Second' },
        { name: 'Third' },
    ];

    return (
        <View style={stylesNotification.NotificationContainer}>
            <View style={stylesNotification.NotificationContainerInner}>
                <View style={stylesNotification.NotificationContent}>
                    <View style={stylesNotification.NotificationEmojiWrapper}>
                        <Text style={stylesNotification.NotificationEmoji}>
                            {emoji}
                        </Text>
                    </View>
                    <View style={stylesNotification.NotificationInfoContainer}>
                        {assignee &&
                            <Text style={stylesNotification.NotificationTitle}>
                                {assignee} {title}
                            </Text>
                        }
                        {time &&
                            <Text style={stylesNotification.NotificationTime}>{time}</Text>
                        }
                    </View>
                </View>
                {buttons &&
                    <View style={stylesNotification.Buttons}>
                        <TouchableOpacity style={[stylesNotification.Button, stylesNotification.ButtonAccept, infoVisible ? stylesNotification.ButtonActive : '']} onPress={toggleInfoVisibility}>
                            <Text style={[stylesNotification.ButtonText, infoVisible ? stylesNotification.ButtonActiveText : '']}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[stylesNotification.Button, stylesNotification.ButtonDecline]}>
                            <Text style={stylesNotification.ButtonText}>Decline</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            {infoVisible && (
                <View style={stylesNotification.InfoBox}>
                    <View style={stylesNotification.InfoBoxTexts}>
                        <Text style={stylesNotification.InfoTitle}>Great! Choose a circle</Text>
                        <Text style={stylesNotification.InfoSubtitle}>Supporters only see tasks from their circle</Text>
                    </View>
                    <View style={stylesNotification.InfoBoxButtons}>
                        {circles.map((circle, index) => (
                            <TouchableOpacity key={index} style={stylesNotification.InfoBoxButton} onPress={() => onAccept(circle.name)}>
                                <Text style={stylesNotification.InfoBoxButtonText}>{circle.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

const stylesNotification = StyleSheet.create({
    NotificationContainer: {
        flexDirection: 'column',
        paddingVertical: 5,
    },
    NotificationContainerInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    NotificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexShrink: 1,
    },
    NotificationEmojiWrapper: {
        width: 45,
        height: 45,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    NotificationEmoji: {
        fontSize: (Platform.OS === 'android') ? 22 : 26,
        textAlign: 'center',
    },
    NotificationInfoContainer: {
        flexShrink: 1,
        gap: 3,
    },
    NotificationTitle: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2,
    },
    NotificationTime: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 14,
    },
    Buttons: {
        flexDirection: 'row',
        gap: 8,
    },
    Button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    ButtonAccept: {
        backgroundColor: '#CFFFC7',
    },
    ButtonActive: {
        backgroundColor: '#1C4837',
    },
    ButtonDecline: {
        backgroundColor: '#E5E5E5',
    },
    ButtonText: {
        color: '#000',
        fontSize: 11,
        fontFamily: 'poppins-regular',
        lineHeight: 15,
    },
    ButtonActiveText: {
        color: '#fff',
    },
    InfoBox: {
        alignItems: 'center',
        padding: 15,
        marginBottom: -15,
        gap: 10,
        backgroundColor: '#fff'
    },
    InfoBoxTexts: {
        alignItems: 'center',
        gap: 2,
    },
    InfoTitle: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'poppins-semibold',
        lineHeight: 16,
    },
    InfoSubtitle: {
        color: '#737373',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 15,
    },
    InfoBoxButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    InfoBoxButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#1C4837',
        borderRadius: 15,
    },
    InfoBoxButtonText: {
        color: '#1C4837',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 17,
    }
});

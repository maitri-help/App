import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';

export default function CircleItem({ item, onPress }) {
    console.log('This emoji:', item.emoji);

    return (
        <TouchableOpacity onPress={onPress} style={stylesCircles.circleListItem}>
            <View style={[stylesCircles.circleListItemEmojiWrapper, item.color ? { borderColor: item.color } : null]}>
                {item.emoji && <Text style={stylesCircles.circleListItemEmoji}>
                    {item.emoji}
                </Text>}
            </View>
            <View style={stylesCircles.circleListItemTextWrapper}>
                <Text style={stylesCircles.circleListItemName}>{item.firstName} {item.lastName}</Text>
                <Text style={stylesCircles.circleListItemText}>{item.circle} circle</Text>
            </View>
        </TouchableOpacity>
    );
}

const stylesCircles = StyleSheet.create({
    circleListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.00,
        elevation: 12,
    },
    circleListItemEmojiWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleListItemEmoji: {
        fontSize: (Platform.OS === 'android') ? 24 : 28,
        textAlign: 'center',
    },
    circleListItemTextWrapper: {
        flexShrink: 1,
        gap: 3,
    },
    circleListItemName: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2,
    },
    circleListItemText: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 14,
    }
});
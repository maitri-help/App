import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function CircleItem({ item }) {
    return (
        <View style={stylesCircles.circleListItem}>
            <View style={[stylesCircles.circleListItemImageWrapper, item.color ? {borderColor: item.color} : null ]}>
                {item.image && <Image source={item.image} style={stylesCircles.circleListItemImage} />}
            </View>
            <View style={stylesCircles.circleListItemTextWrapper}>
                <Text style={stylesCircles.circleListItemName}>{item.firstName} {item.lastName}</Text>
                <Text style={stylesCircles.circleListItemText}>{item.circle}</Text>
            </View>
        </View>
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.00,
        elevation: 8,
    },
    circleListItemImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleListItemImage: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
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
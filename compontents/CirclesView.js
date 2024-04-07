import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Circles from '../assets/img/circles.svg';

export default function CirclesView({ circleItemsContent }) {
    return (
        <>
            <Circles width={545} height={545} style={stylesCircles.circles} />
            <View style={stylesCircles.circleItems}>
                {circleItemsContent.map((item, index) => (
                    <View key={index} style={[stylesCircles.circleItemWrapper, index === 0 ? stylesCircles.circleItemOuterWrapper : index === 1 ? stylesCircles.circleItemMiddleWrapper : stylesCircles.circleItemInnerWrapper]}>
                        {item.image && (
                            <>
                                <View style={[stylesCircles.circleItem, index === 0 ? stylesCircles.circleItemOuter : index === 1 ? stylesCircles.circleItemMiddle : stylesCircles.circleItemInner]}>
                                    <Image source={item.image} style={[stylesCircles.emoji, index === 0 ? stylesCircles.emojiOuter : index === 1 ? stylesCircles.emojiMiddle : stylesCircles.emojiInner]} />
                                </View>
                                <Text style={[stylesCircles.circleItemText, stylesCircles.circleItemTextOutside]}>{item.firstName}</Text>
                            </>
                        )}
                        {!item.image && (
                            <View style={[stylesCircles.circleItem, index === 0 ? stylesCircles.circleItemOuter : index === 1 ? stylesCircles.circleItemMiddle : stylesCircles.circleItemInner]}>
                                <Text style={stylesCircles.circleItemText}>{item.firstName}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </>
    );
}

const stylesCircles = StyleSheet.create({
    circles: {
        position: 'relative',
        zIndex: 1,
    },
    circleItems: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    circleItemWrapper: {
        position: 'absolute',
    },
    circleItem: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleItemText: {
        textAlign: 'center',
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
    },
    circleItemTextOutside: {
        paddingTop: 4,
        marginBottom: -20
    },
    circleItemOuterWrapper: {
        bottom: -15,
        transform: [{ translateX: 60 }],
    },
    circleItemOuter: {
        borderColor: '#CFF7B5',
        borderWidth: 8,
        width: 58,
        height: 58,
        borderRadius: 30,
    },
    circleItemMiddleWrapper: {
        top: 80,
        transform: [{ translateX: 100 }],
    },
    circleItemMiddle: {
        borderColor: '#8BD759',
        borderWidth: 10,
        width: 78,
        height: 78,
        borderRadius: 40,
    },
    circleItemInnerWrapper: {
        bottom: 135,
        transform: [{ translateX: -25 }],
    },
    circleItemInner: {
        borderColor: '#1C4837',
        borderWidth: 12,
        width: 98,
        height: 98,
        borderRadius: 50,
    },
    emoji: {
        resizeMode: 'contain',
    },
    emojiOuter: {
        width: 30,
        height: 30,
    },
    emojiMiddle: {
        width: 40,
        height: 40,
    },
    emojiInner: {
        width: 50,
        height: 50,
    },
});
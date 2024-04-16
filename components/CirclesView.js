import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import Circles from '../assets/img/circles.svg';

export default function CirclesView({ circleItemsContent, additionalItemCountFirst, additionalItemCountSecond, additionalItemCountThird, onPressCircleItemCount, onPressCircleItem }) {

    return (
        <View style={stylesCircles.circlesContainerInner}>
            <Circles width={545} height={545} style={stylesCircles.circles} />
            <View style={stylesCircles.circleItems}>
                {circleItemsContent.map((item, index) => (
                    <React.Fragment key={index}>
                        <View style={[stylesCircles.circleItemWrapper, index === 0 ? stylesCircles.circleItemOuterWrapper : index === 1 ? stylesCircles.circleItemMiddleWrapper : stylesCircles.circleItemInnerWrapper]}>
                            {item.image && (
                                <React.Fragment>
                                    <TouchableOpacity activeOpacity={1} onPress={() => onPressCircleItem(item)} style={[stylesCircles.circleItem, index === 0 ? stylesCircles.circleItemOuter : index === 1 ? stylesCircles.circleItemMiddle : stylesCircles.circleItemInner]}>
                                        <Image source={item.image} style={[stylesCircles.emoji, index === 0 ? stylesCircles.emojiOuter : index === 1 ? stylesCircles.emojiMiddle : stylesCircles.emojiInner]} />
                                    </TouchableOpacity>
                                    <Text style={[stylesCircles.circleItemText, stylesCircles.circleItemTextOutside]}>{item.firstName}</Text>
                                </React.Fragment>
                            )}
                            {!item.image && (
                                <View style={[stylesCircles.circleItem, index === 0 ? stylesCircles.circleItemOuter : index === 1 ? stylesCircles.circleItemMiddle : stylesCircles.circleItemInner]}>
                                    <Text style={stylesCircles.circleItemText}>{item.firstName}</Text>
                                </View>
                            )}
                        </View>
                        {index === 2 && additionalItemCountThird > 0 && (
                            <TouchableOpacity activeOpacity={1} style={[stylesCircles.circleItemCount, stylesCircles.circleItemCountThird]} onPress={() => onPressCircleItemCount('Third')}
                            >
                                <Text style={stylesCircles.circleItemCountText}>+{additionalItemCountThird}</Text>
                            </TouchableOpacity>
                        )}
                        {index === 1 && additionalItemCountSecond > 0 && (
                            <TouchableOpacity activeOpacity={1} style={[stylesCircles.circleItemCount, stylesCircles.circleItemCountSecond]} onPress={() => onPressCircleItemCount('Second')}
                            >
                                <Text style={stylesCircles.circleItemCountText}>+{additionalItemCountSecond}</Text>
                            </TouchableOpacity>
                        )}
                        {index === 0 && additionalItemCountFirst > 0 && (
                            <TouchableOpacity activeOpacity={1} style={[stylesCircles.circleItemCount, stylesCircles.circleItemCountFirst]} onPress={() => onPressCircleItemCount('First')}
                            >
                                <Text style={stylesCircles.circleItemCountText}>+{additionalItemCountFirst}</Text>
                            </TouchableOpacity>
                        )}
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
}

const stylesCircles = StyleSheet.create({
    circlesContainerInner: {
        position: 'relative',
        marginLeft: '-52%',
        flexShrink: 1,
    },
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
        alignItems: 'center',
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
        marginBottom: -22,
        backgroundColor: '#fff',
        padding: 3,
        borderRadius: 10,
        marginTop: 2,
        overflow: 'hidden'
    },
    circleItemOuterWrapper: {
        bottom: -12,
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
        transform: [{ translateX: (Platform.OS === 'android') ? 90 : 98 }],
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
    circleItemCount: {
        borderColor: '#D1D1D1',
        borderWidth: 2,
        backgroundColor: '#fff',
        width: 36,
        height: 36,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 3,
    },
    circleItemCountText: {
        color: '#A0A0A0',
        fontSize: 13,
        fontFamily: 'poppins-medium',
        lineHeight: 18,
    },
    circleItemCountFirst: {
        bottom: (Platform.OS === 'android') ? 210 : 200,
        transform: [{ translateX: (Platform.OS === 'android') ? 60 : 70 }],
    },
    circleItemCountSecond: {
        transform: [{ translateX: (Platform.OS === 'android') ? 160 : 175 }],
    },
    circleItemCountThird: {
        bottom: (Platform.OS === 'android') ? 45 : 35,
        transform: [{ translateX: 145 }],
    },
});
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RoleSelector = ({
    pressHnadler,
    role,
    description,
    imageSrc,
    values,
    disabled
}) => {
    return (
        <TouchableOpacity
            onPress={pressHnadler}
            style={[
                stylesRole.optionButton,
                values.role === role && stylesRole.activeOption,
                disabled && { opacity: 0.5, pointerEvents: 'none' }
            ]}
        >
            <View
                style={[
                    stylesRole.optionButtonBorder,
                    values.role === role && stylesRole.optionButtonBorderActive
                ]}
            ></View>
            <View style={stylesRole.optionButtonTop}>
                <Image source={imageSrc} style={stylesRole.emoji} />
                <Text style={stylesRole.optionButtonTitle}>{role}</Text>
            </View>
            <Text style={stylesRole.optionButtonText}>{description}</Text>
        </TouchableOpacity>
    );
};

export default RoleSelector;

const stylesRole = StyleSheet.create({
    optionButton: {
        width: 310,
        height: 100,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        borderRadius: 50,
        borderColor: '#737373',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    activeOption: {
        borderColor: 'transparent'
    },
    optionButtonBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        minWidth: '100%',
        width: 310,
        height: 100,
        borderColor: '#1C4837',
        borderRadius: 50,
        borderWidth: 6,
        backgroundColor: 'transparent',
        opacity: 0
    },
    optionButtonBorderActive: {
        opacity: 1
    },
    optionButtonTop: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 5
    },
    optionButtonTitle: {
        fontSize: 16,
        fontFamily: 'poppins-medium'
    },
    emoji: {
        width: 22,
        height: 22
    },
    optionButtonText: {
        color: '#7A7A7A',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        textAlign: 'center'
    }
});

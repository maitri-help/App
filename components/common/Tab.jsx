import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Tab = ({ clickHandler, label, isActive }) => {
    return (
        <TouchableOpacity
            onPress={clickHandler}
            style={[stylesCircles.tab, isActive && stylesCircles.activeTab]}
        >
            <Text
                style={[
                    stylesCircles.tabText,
                    isActive && stylesCircles.activeTabText
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default Tab;

const stylesCircles = StyleSheet.create({
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center'
    },
    activeTab: {
        backgroundColor: '#1C4837'
    },
    tabText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16
    },
    activeTabText: {
        color: '#fff'
    }
});

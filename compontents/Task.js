import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function Task({ title, assignee, time, image }) {
    const formattedAssignee = Array.isArray(assignee) ? assignee.join(', ') : assignee;

    return (
        <TouchableOpacity style={stylesTask.taskContainer}>
            <View style={stylesTask.taskImageWrapper}>
                <Image source={image} style={stylesTask.taskImage} />
            </View>
            <View style={stylesTask.taskInfoContainer}>
                <Text style={stylesTask.taskTitle}>{title}</Text>
                {assignee && <Text style={stylesTask.taskAssignee}>{formattedAssignee}</Text>}
                <Text style={stylesTask.taskTime}>{time}</Text>
            </View>
        </TouchableOpacity>
    );
};

const stylesTask = StyleSheet.create({
    taskContainer: {
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
    },
    taskImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    taskImage: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    taskInfoContainer: {
        flexShrink: 1,
        gap: 3,
    },
    taskTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        fontWeight: '400',
        lineHeight: 16,
        marginBottom: 2,
    },
    taskAssignee: {
        color: '#747474',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        fontWeight: '400',
        lineHeight: 14,
    },
    taskTime: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        fontWeight: '300',
        lineHeight: 14,
    }
});
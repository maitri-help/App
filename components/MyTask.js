import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

export default function Task({ task, title, firstName, lastName, startTime, endTime, taskModal, onTaskItemClick }) {

    const formatDateTime = () => {
        const formattedStartDateTime = formatDate(startTime);
        const formattedEndDateTime = formatDate(endTime);
        return `${formattedStartDateTime} - ${formattedEndDateTime}`;
    };

    const formatDate = (date) => {
        const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const handleClick = () => {
        onTaskItemClick(task);
        taskModal();
    };

    return (
        <TouchableOpacity style={stylesTask.taskContainer} activeOpacity={0.7} onPress={handleClick}>
            <View style={stylesTask.taskInfoContainer}>
                <Text style={stylesTask.taskTitle}>{title}</Text>
                {firstName && lastName && (
                    <Text style={stylesTask.taskAssignee}>{firstName} {lastName}</Text>
                )}
                <Text style={stylesTask.taskTime}>{formatDateTime()}</Text>
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
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.00,
        elevation: 12,
    },
    taskInfoContainer: {
        flexShrink: 1,
        gap: 3,
        minHeight: 50,
        justifyContent: 'center',
    },
    taskTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2,
    },
    taskAssignee: {
        color: '#747474',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 14,
    },
    taskTime: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 14,
    }
});
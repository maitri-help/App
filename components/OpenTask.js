import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image
} from 'react-native';
import { findIcon } from '../helpers/task.helpers';
import { formatTaskItemDate } from '../helpers/date';

export default function OpenTask({ task, taskModal, onTaskItemClick }) {
    const handleClick = () => {
        onTaskItemClick(task);
        taskModal();
    };

    const icon = findIcon(task);

    return (
        <TouchableOpacity
            style={stylesTask.taskContainer}
            activeOpacity={0.7}
            onPress={handleClick}
        >
            <View style={[stylesTask.serviceIconWrapper]}>
                {icon && <Image source={icon} style={stylesTask.serviceIcon} />}
            </View>
            <View style={stylesTask.taskInfoContainer}>
                <Text style={stylesTask.taskTitle}>{task?.title}</Text>
                <Text style={stylesTask.taskTime}>
                    {formatTaskItemDate(task)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const stylesTask = StyleSheet.create({
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.0,
        elevation: 12
    },
    serviceIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center'
    },
    serviceIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    taskInfoContainer: {
        flexShrink: 1,
        gap: 3
    },
    taskTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2
    },
    taskAssignee: {
        color: '#747474',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 14
    },
    taskTime: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 14
    }
});

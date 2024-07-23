import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
    Modal,
    Linking
} from 'react-native';
import AddToCalICon from '../assets/icons/add-to-cal-icon.svg';
import { getAccessToken } from '../authStorage';
import { updateTask } from '../hooks/api';
import CheckIcon from '../assets/icons/check-medium-icon.svg';
import { useToast } from 'react-native-toast-notifications';
import * as Calendar from 'expo-calendar';
import { findIcon, sortTasksByStartDate } from '../helpers/task.helpers';
import { formatTaskItemDate } from '../helpers/date';
import { useTask } from '../context/TaskContext';
import CalendarPermissionModal from './Modals/CalendarPermissionModal';
import { createCalendarEvent } from '../helpers/calendar.helper';

export default function MyTask({
    task,
    taskModal,
    onTaskItemClick,
    isCheckbox
}) {
    const isChecked = task.status === 'done' ? true : false;
    const toast = useToast();
    const { setTasks } = useTask();

    const handleToggleCheckbox = async () => {
        const newStatus = isChecked ? 'undone' : 'done';
        const updatedTask = { status: newStatus };

        try {
            const accessToken = await getAccessToken();
            const res = await updateTask(task.taskId, updatedTask, accessToken);
            setTasks((prev) => {
                //remove the updated task from the list
                const filteredTasks = prev.filter(
                    (task) => task.taskId !== res?.data.taskId
                );
                const newTasks = sortTasksByStartDate([
                    res?.data,
                    ...filteredTasks
                ]);
                return newTasks;
            });
            toast.show(`Task is set to: ${newStatus}`, { type: 'success' });
        } catch (error) {
            toast.show('Error updating task status', { type: 'error' });
            console.error('Error updating task:', error);
        }
    };

    const icon = findIcon(task);

    const handleClick = () => {
        onTaskItemClick(task);
        taskModal();
    };

    const [calendarPermission] = Calendar.useCalendarPermissions();
    const [calendarPermissionNeeded, setCalendarPermissionNeeded] =
        useState(false);

    const handleOpenCalendar = async () => {
        if (!calendarPermission.granted) {
            const permission = await Calendar.requestCalendarPermissionsAsync();
            if (!permission.granted) {
                setCalendarPermissionNeeded(true);
                return;
            }
        }

        await createCalendarEvent(task)
            .then((res) => {
                console.log('Event added to calendar:', res);
                toast.show('Event added to calendar', { type: 'success' });
            })
            .catch((error) => {
                console.error('Error adding event to calendar:', error);
                toast.show('Failed to add event to calendar', { type: 'error' });
            });
    };

    return (
        <>
            <TouchableOpacity
                style={[
                    stylesTask.taskContainer,
                    isChecked && stylesTask.greyedOut
                ]}
                activeOpacity={0.7}
                onPress={handleClick}
            >
                <View style={{ flexDirection: 'row', gap: 20, flexShrink: 1 }}>
                    {isCheckbox && (
                        <TouchableOpacity
                            style={stylesTask.checkboxWrapper}
                            onPress={handleToggleCheckbox}
                        >
                            <View
                                style={
                                    isChecked
                                        ? stylesTask.checkboxChecked
                                        : stylesTask.checkbox
                                }
                            >
                                {isChecked && (
                                    <View style={stylesTask.checkboxInner}>
                                        <CheckIcon
                                            width={13}
                                            height={13}
                                            style={stylesTask.checkboxIcon}
                                        />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={stylesTask.taskInfoContainer}>
                        <Text
                            style={[
                                stylesTask.taskTitle,
                                isChecked ? stylesTask.textStriked : '',
                                isChecked && stylesTask.greyedOut
                            ]}
                        >
                            {task?.title}
                        </Text>
                        {task?.assignee?.firstName &&
                            task?.assignee?.lastName && (
                                <Text style={stylesTask.taskAssignee}>
                                    {task?.assignee?.firstName}{' '}
                                    {task?.assignee?.lastName}
                                </Text>
                            )}
                        <Text
                            style={[
                                stylesTask.taskTime,
                                isChecked ? stylesTask.textStriked : '',
                                isChecked && stylesTask.greyedOut
                            ]}
                        >
                            {formatTaskItemDate(task)}
                        </Text>
                    </View>
                </View>
                <View style={stylesTask.iconsWrapper}>
                    {!isChecked && (
                        <TouchableOpacity
                            style={stylesTask.addToCalIconWrapper}
                            onPress={handleOpenCalendar}
                        >
                            <AddToCalICon
                                width={30}
                                height={30}
                                style={stylesTask.addToCalIcon}
                            />
                        </TouchableOpacity>
                    )}
                    <View style={stylesTask.serviceIconWrapper}>
                        <Image source={icon} style={stylesTask.serviceIcon} />
                    </View>
                </View>
            </TouchableOpacity>

            {calendarPermissionNeeded && (
                <CalendarPermissionModal
                    calendarPermissionNeeded={calendarPermissionNeeded}
                    setCalendarPermissionNeeded={setCalendarPermissionNeeded}
                />
            )}
        </>
    );
}

const stylesTask = StyleSheet.create({
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 15,
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
    innerModalButtonRedText: {
        color: '#fff'
    },
    innerModalButtonRed: {
        backgroundColor: '#FF7070'
    },
    taskInfoContainer: {
        flexShrink: 1,
        gap: 3,
        minHeight: 50,
        justifyContent: 'center'
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
    },
    iconsWrapper: {
        flexDirection: 'row',
        gap: 5,
        paddingRight: 10
    },
    serviceIconWrapper: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    serviceIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    addToCalIconWrapper: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addToCalIcon: {
        marginLeft: -5,
        marginBottom: -5
    },
    textStriked: {
        textDecorationLine: 'line-through'
    },
    checkboxWrapper: {
        height: '100%',
        padding: 15,
        paddingRight: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },
    checkbox: {
        borderWidth: 1,
        borderColor: '#000',
        width: 18,
        height: 18,
        borderRadius: 9,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxChecked: {
        borderColor: '#6AAA5F'
    },
    checkboxInner: {
        backgroundColor: '#6AAA5F',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10
    },
    checkboxIcon: {
        resizeMode: 'contain',
        color: '#fff'
    },
    greyedOut: {
        color: '#B0B0B0'
    },
    innerModalContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        maxWidth: 350,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    innerModalTexts: {
        marginBottom: 20
    },
    innerModalTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 5
    },
    innerModalSubtitle: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center'
    },
    innerModalButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center'
    },
    innerModalButton: {
        alignItems: 'center',
        minWidth: 125,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8
    },
    innerModalButtonGreen: {
        backgroundColor: '#1C4837'
    },
    innerModalButtonWhite: {
        backgroundColor: '#fff'
    },
    innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18
    },
    innerModalButtonGreenText: {
        color: '#fff'
    },
    innerModalButtonWhiteText: {
        color: '#000'
    }
});

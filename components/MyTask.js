import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, Linking } from "react-native";
import { modalServices } from '../data/ModalServices';
import AddToCalICon from '../assets/icons/add-to-cal-icon.svg';
import { getAccessToken } from '../authStorage';
import { updateTask } from '../hooks/api';
import { useToast } from 'react-native-toast-notifications';
import * as Calendar from 'expo-calendar';

export default function Task({ task, title, firstName, lastName, startTime, endTime, taskModal, onTaskItemClick, category, isCheckbox, onTaskStatusChange }) {
    const [isChecked, setIsChecked] = useState(task.status === 'done');
    const toast = useToast();

    useEffect(() => {
        setIsChecked(task.status === 'done');
    }, [task.status]);

    const handleToggleCheckbox = async () => {
        const newStatus = isChecked ? 'undone' : 'done';
        const updatedTask = { status: newStatus };

        try {
            const accessToken = await getAccessToken();
            await updateTask(task.taskId, updatedTask, accessToken);
            setIsChecked(!isChecked);
            toast.show(`Task is set to: ${newStatus}`, { type: 'success' });
            onTaskStatusChange();
        } catch (error) {
            toast.show('Error updating task status', { type: 'error' });
            console.error('Error updating task:', error);
        }
    };

    const formatDateTime = () => {
        const formattedStartDateTime = formatDate(startTime);
        const formattedEndDateTime = formatDate(endTime);
        return `${formattedStartDateTime} - ${formattedEndDateTime}`;
    };

    const formatDate = (date) => {
        const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const findIcon = () => {
        const service = modalServices.find(service => service.title === category);
        return service ? service.icon : null;
    };

    const icon = findIcon();

    const handleClick = () => {
        onTaskItemClick(task);
        taskModal();
    };

    const [calendarPermission] = Calendar.useCalendarPermissions();
    const [calendarPermissionNeeded, setCalendarPermissionNeeded] = useState(false);

    const handleOpenCalendar = async () => {
        // console.log('CALENDAR PERMISSION:', calendarPermission);
        if (!calendarPermission.granted) {
            setCalendarPermissionNeeded(true);
            return;
        }

        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('CALENDARS:', calendars);
        const defaultCalendar = Platform.select({
            ios: calendars.find(cal => cal.allowsModifications /* && cal.source.name === 'Default' */),
            android: calendars.find(cal => cal.accessLevel === "owner" && cal.name === cal.ownerAccount),
        });

        if (!defaultCalendar) {
            console.error('Default calendar not found');
            toast.show('Default calendar not found', { type: 'error' });
            return;
        }

        const event = {
            title: task.title,
            startDate: new Date(task.startDateTime),
            endDate: new Date(task.endDateTime),
            notes: task.description,
        };

        await Calendar.createEventAsync(defaultCalendar.id, event)
            .then((event) => {
                console.log('Event added to calendar: ', event);
                toast.show('Event added to calendar', { type: 'success' });
            })
            .catch((error) => {
                console.error('Error adding event to calendar:', error);
                toast.show('Error adding event to calendar', { type: 'error' });
            });
    }

    const handleGoToSettings = () => {
        Linking.openSettings();
        setCalendarPermissionNeeded(false);
    };

    return (
        <>
            <TouchableOpacity style={[stylesTask.taskContainer, isChecked && stylesTask.greyedOut]} activeOpacity={0.7} onPress={handleClick}>
                {isCheckbox &&
                    <TouchableOpacity style={stylesTask.checkboxWrapper} onPress={handleToggleCheckbox}>
                        <View style={isChecked ? stylesTask.checkboxChecked : stylesTask.checkbox}>
                            {isChecked &&
                                <View style={stylesTask.checkboxInner}>
                                    <CheckIcon width={13} height={13} style={stylesTask.checkboxIcon} />
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                }

                <View style={stylesTask.taskInfoContainer}>
                    <Text style={[stylesTask.taskTitle, isChecked ? stylesTask.textStriked : '', isChecked && stylesTask.greyedOut]}>{title}</Text>
                    {firstName && lastName && (
                        <Text style={stylesTask.taskAssignee}>{firstName} {lastName}</Text>
                    )}
                    <Text style={[stylesTask.taskTime, isChecked ? stylesTask.textStriked : '', isChecked && stylesTask.greyedOut]}>{formatDateTime()}</Text>
                </View>
                <View style={stylesTask.iconsWrapper}>
                    <TouchableOpacity style={stylesTask.addToCalIconWrapper} onPress={handleOpenCalendar}>
                        <AddToCalICon width={30} height={30} style={stylesTask.addToCalIcon} />
                    </TouchableOpacity>
                    <View style={stylesTask.serviceIconWrapper}>
                        <Image source={icon} style={stylesTask.serviceIcon} />
                    </View>
                </View>
            </TouchableOpacity>

            {calendarPermissionNeeded && (
                <Modal visible={calendarPermissionNeeded} onRequestClose={() => console.log("close")} animationType='fade' transparent>
                    <TouchableOpacity onPress={() => console.log("close")} style={stylesTask.innerModalContainer}>
                        <View style={stylesTask.innerModalContent}>
                            <View style={stylesTask.innerModalTexts}>
                                <Text style={stylesTask.innerModalTitle}>Please provide access for this app to your calendar.</Text>
                                <Text style={stylesTask.innerModalSubtitle}>Without acces we cannot export this event to your calendar.</Text>
                            </View>
                            <View style={stylesTask.innerModalButtons}>
                                <TouchableOpacity style={[stylesTask.innerModalButton, stylesTask.innerModalButtonRed]} onPress={handleGoToSettings}>
                                    <Text style={[stylesTask.innerModalButtonText, stylesTask.innerModalButtonRedText]}>Go to Settings</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </>
    );
};

const stylesTask = StyleSheet.create({
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 15,
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
    },
    iconsWrapper: {
        flexDirection: 'row',
        gap: 5,
        paddingRight: 10,
    },
    serviceIconWrapper: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    addToCalIconWrapper: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCalIcon: {
        marginLeft: -5,
        marginBottom: -5,
    },
    textStriked: {
        textDecorationLine: 'line-through',
    },
    checkboxWrapper: {
        height: '100%',
        padding: 15,
        paddingRight: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    checkbox: {
        borderWidth: 1,
        borderColor: '#000',
        width: 18,
        height: 18,
        borderRadius: 9,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        borderColor: '#6AAA5F',
    },
    checkboxInner: {
        backgroundColor: '#6AAA5F',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    checkboxIcon: {
        resizeMode: 'contain',
        color: '#fff',
    },
    greyedOut: {
        color: '#B0B0B0',
    },
    innerModalContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        maxWidth: 350,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    innerModalTexts: {
        marginBottom: 20,
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
        textAlign: 'center',
    },
    innerModalButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    innerModalButton: {
        alignItems: 'center',
        minWidth: 125,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    innerModalButtonGreen: {
        backgroundColor: '#1C4837',
    },
    innerModalButtonWhite: {
        backgroundColor: '#fff',
    },
    innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18,
    },
    innerModalButtonGreenText: {
        color: '#fff',
    },
    innerModalButtonWhiteText: {
        color: '#000',
    },
});
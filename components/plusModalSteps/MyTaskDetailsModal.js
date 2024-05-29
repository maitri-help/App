import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    Linking
} from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import LocationPicker from './LocationPicker';
import { unassingUserToTask } from '../../hooks/api';
import { getAccessToken } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';
import ModalCustom from '../Modal';
import { ScrollView } from 'react-native-gesture-handler';
import CalendarIcon from '../../assets/icons/calendar-icon.svg';
import * as Calendar from 'expo-calendar';

export default function TaskDetailsModal({
    visible,
    selectedTask,
    onClose,
    updateTask
}) {
    const [dateTimeText, setDateTimeText] = useState(null);
    const toast = useToast();

    const [taskId, setTaskId] = useState(null);
    const [taskName, setTaskName] = useState(null);
    const [description, setDescription] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    const [showInnerModal, setShowInnerModal] = useState(false);

    useEffect(() => {
        if (selectedTask) {
            setTaskId(selectedTask.taskId);
            setTaskName(selectedTask.title);
            setDescription(selectedTask.description);
            setSelectedLocation(selectedTask.location);

            setStartDateTime(selectedTask.startDateTime);
            setEndDateTime(selectedTask.endDateTime);
        }
    }, [selectedTask, setStartDateTime, setEndDateTime]);

    useEffect(() => {
        if (startDateTime && endDateTime) {
            const options = {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            };
            const start = new Date(startDateTime).toLocaleString(
                'en-US',
                options
            );
            const end = new Date(endDateTime).toLocaleString('en-US', options);
            setDateTimeText(`${start} - ${end}`);
        }
    }, [startDateTime, endDateTime]);

    const openInnerModal = () => {
        setShowInnerModal(true);
    };

    const closeInnerModal = () => {
        setShowInnerModal(false);
    };

    const handleSubmit = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                toast.show('Access token not found. Please log in.', {
                    type: 'error'
                });
                return;
            }

            await unassingUserToTask(taskId, accessToken);

            toast.show('Unassigned from task successfully', {
                type: 'success'
            });

            onClose();
            updateTask();
        } catch (error) {
            console.error('Error updating task:', error);

            toast.show('Unsuccessful task unassign', { type: 'error' });
        }
    };

    const [calendarPermission] = Calendar.useCalendarPermissions();
    const [calendarPermissionNeeded, setCalendarPermissionNeeded] =
        useState(false);

    const handleOpenCalendar = async () => {
        if (!calendarPermission.granted) {
            setCalendarPermissionNeeded(true);
            return;
        }

        const calendars = await Calendar.getCalendarsAsync(
            Calendar.EntityTypes.EVENT
        );

        const defaultCalendar = Platform.select({
            ios: calendars.find(
                (cal) =>
                    cal.allowsModifications /* && cal.source.name === 'Default' */
            ),
            android: calendars.find(
                (cal) =>
                    cal.accessLevel === 'owner' && cal.name === cal.ownerAccount
            )
        });

        if (!defaultCalendar) {
            console.error('Default calendar not found');
            toast.show('Default calendar not found', { type: 'error' });
            return;
        }

        const event = {
            title: taskName,
            startDate: new Date(startDateTime),
            endDate: new Date(endDateTime),
            notes: description
        };

        await Calendar.createEventAsync(defaultCalendar.id, event)
            .then((event) => {
                toast.show('Event added to calendar', { type: 'success' });
            })
            .catch((error) => {
                console.error('Error adding event to calendar:', error);
                toast.show('Error adding event to calendar', { type: 'error' });
            });
    };

    const handleGoToSettings = () => {
        Linking.openSettings();
        setCalendarPermissionNeeded(false);
    };

    return (
        <ModalCustom visible={visible} onClose={onClose} style={stylesModal}>
            <View style={[styles.modalTopNav, stylesModal.modalTopNav]}>
                <View style={stylesModal.modalTopNavLeft}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.backLinkInline]}
                    >
                        <ArrowLeftIcon
                            width={18}
                            height={18}
                            style={styles.backLinkIcon}
                        />
                    </TouchableOpacity>
                    <Text style={[stylesModal.field, stylesModal.fieldTask]}>
                        {taskName}
                    </Text>
                </View>
            </View>
            <View style={[styles.contentContainer, stylesModal.topDescription]}>
                <View style={stylesModal.topDescription}>
                    <Text style={[styles.text]}>{description}</Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={[stylesModal.group, stylesModal.groupFirst]}>
                        <View
                            style={[
                                styles.contentContainer,
                                stylesModal.groupInner
                            ]}
                        >
                            <Text style={stylesModal.groupTitle}>
                                Date & Time
                            </Text>
                            <View style={stylesModal.fieldWrapper}>
                                <Text style={stylesModal.fieldText}>
                                    {dateTimeText}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={stylesModal.group}>
                        <View
                            style={[
                                styles.contentContainer,
                                stylesModal.groupInner
                            ]}
                        >
                            <Text style={stylesModal.groupTitle}>Location</Text>
                            <View style={stylesModal.fieldWrapper}>
                                <LocationPicker
                                    selectedLocation={selectedLocation}
                                    disabled
                                />
                            </View>
                        </View>
                    </View>
                    {/* <View style={[stylesModal.group, { borderBottomWidth: 0 }]}>
                        <View style={[styles.contentContainer, stylesModal.groupInner]}>
                            <Text style={[stylesModal.groupTitle]}>Notes</Text>
                            <Text style={stylesModal.fieldText}>
                                {description}
                            </Text>
                        </View>
                    </View> */}
                </ScrollView>
            </View>

            <View style={styles.contentContainer}>
                <View style={stylesModal.calendarButtonContainer}>
                    <TouchableOpacity
                        style={stylesModal.calendarButton}
                        onPress={handleOpenCalendar}
                    >
                        <Text style={stylesModal.calendarButtonText}>
                            Add To My Calendar
                        </Text>
                        <CalendarIcon width={25} height={25} color={'#fff'} />
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={[
                    styles.contentContainer,
                    { marginTop: 50, marginBottom: 60 }
                ]}
            >
                <TouchableOpacity
                    style={stylesModal.removeLink}
                    onPress={openInnerModal}
                >
                    <Text style={stylesModal.removeLinkText}>
                        I can no longer complete this task
                    </Text>
                </TouchableOpacity>
            </View>

            {showInnerModal && (
                <Modal
                    visible={showInnerModal}
                    animationType="fade"
                    onRequestClose={closeInnerModal}
                    transparent
                >
                    <TouchableOpacity
                        onPress={closeInnerModal}
                        style={stylesModal.innerModalContainer}
                    >
                        <View style={stylesModal.innerModalContent}>
                            <View style={stylesModal.innerModalTexts}>
                                <Text style={stylesModal.innerModalTitle}>
                                    You are about to remove this task from your
                                    list
                                </Text>
                            </View>
                            <View style={stylesModal.innerModalButtons}>
                                <TouchableOpacity
                                    style={[
                                        stylesModal.innerModalButton,
                                        stylesModal.innerModalButtonGreen
                                    ]}
                                    onPress={handleSubmit}
                                >
                                    <Text
                                        style={[
                                            stylesModal.innerModalButtonText,
                                            stylesModal.innerModalButtonGreenText
                                        ]}
                                    >
                                        Remove
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        stylesModal.innerModalButton,
                                        stylesModal.innerModalButtonWhite
                                    ]}
                                    onPress={closeInnerModal}
                                >
                                    <Text
                                        style={[
                                            stylesModal.innerModalButtonText,
                                            stylesModal.innerModalButtonWhiteText
                                        ]}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            {calendarPermissionNeeded && (
                <Modal
                    visible={calendarPermissionNeeded}
                    onRequestClose={() => console.log('close')}
                    animationType="fade"
                    transparent
                >
                    <TouchableOpacity
                        onPress={() => console.log('close')}
                        style={stylesModal.innerModalContainer}
                    >
                        <View style={stylesModal.innerModalContent}>
                            <View style={stylesModal.innerModalTexts}>
                                <Text style={stylesModal.innerModalTitle}>
                                    Please provide access for this app to your
                                    calendar.
                                </Text>
                                <Text style={stylesModal.innerModalSubtitle}>
                                    Without acces we cannot export this event to
                                    your calendar.
                                </Text>
                            </View>
                            <View style={stylesModal.innerModalButtons}>
                                <TouchableOpacity
                                    style={[
                                        stylesModal.innerModalButton,
                                        stylesModal.innerModalButtonRed
                                    ]}
                                    onPress={handleGoToSettings}
                                >
                                    <Text
                                        style={[
                                            stylesModal.innerModalButtonText,
                                            stylesModal.innerModalButtonRedText
                                        ]}
                                    >
                                        Go to Settings
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </ModalCustom>
    );
}

const stylesModal = StyleSheet.create({
    taskNotes: {
        textAlignVertical: 'top',
        flexShrink: 1
    },
    modalTopNav: {
        justifyContent: 'space-between'
    },
    modalTopNavLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    topDescription: {
        marginBottom: 20
    },
    fieldWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexShrink: 1,
        flexGrow: 1
    },
    field: {
        borderWidth: 0,
        padding: 0,
        margin: 0,
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000',
        flexShrink: 1
    },
    fieldTask: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'poppins-medium'
    },
    fieldText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000'
    },
    name: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16
    },
    group: {
        paddingVertical: 15,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1
    },
    groupFirst: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1
    },
    groupInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
    },
    groupTitle: {
        width: 100,
        color: '#9F9F9F',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18
    },
    removeLinkText: {
        color: '#FF7070',
        fontSize: 15,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        textDecorationLine: 'underline',
        textAlign: 'center'
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
    },
    calendarButtonContainer: {
        marginTop: 70,
        marginHorizontal: 35
    },
    calendarButton: {
        backgroundColor: '#1C4837',
        paddingVertical: 15,
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6
    },
    calendarButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        color: '#fff'
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
    innerModalButtonRed: {
        backgroundColor: '#FF7070'
    },
    innerModalButtonWhite: {
        backgroundColor: '#fff'
    },
    innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18
    },
    innerModalButtonRedText: {
        color: '#fff'
    },
    innerModalButtonWhiteText: {
        color: '#000'
    }
});

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform
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
import { formatTaskItemDate } from '../../helpers/date';
import RejectTaskModal from '../Modals/RejectTaskModal';
import CalendarPermissionModal from '../Modals/CalendarPermissionModal';
import { useTask } from '../../context/TaskContext';
import { sortTasksByStartDate } from '../../helpers/task.helpers';

export default function MyTaskDetailsModal({ visible, selectedTask, onClose }) {
    const toast = useToast();

    const [showInnerModal, setShowInnerModal] = useState(false);
    const { setTasks } = useTask();

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

            const res = await unassingUserToTask(
                selectedTask?.taskId,
                accessToken
            );

            setTasks((prev) => {
                //remove the updated task from the list
                const filteredTasks = prev.filter(
                    (task) => task.taskId !== res.data?.taskId
                );

                const newTasks = sortTasksByStartDate([
                    res.data,
                    ...filteredTasks
                ]);
                return newTasks;
            });

            toast.show('Unassigned from task successfully', {
                type: 'success'
            });

            onClose();
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
                        {selectedTask?.title}
                    </Text>
                </View>
            </View>
            {selectedTask?.description && (
                <View
                    style={[
                        styles.contentContainer,
                        stylesModal.topDescription
                    ]}
                >
                    <View style={stylesModal.topDescription}>
                        <Text style={[styles.text]}>
                            {selectedTask?.description}
                        </Text>
                    </View>
                </View>
            )}
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
                                    {formatTaskItemDate(selectedTask)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {selectedTask?.location && (
                        <View style={stylesModal.group}>
                            <View
                                style={[
                                    styles.contentContainer,
                                    stylesModal.groupInner
                                ]}
                            >
                                <Text style={stylesModal.groupTitle}>
                                    Location
                                </Text>
                                <View style={stylesModal.fieldWrapper}>
                                    <LocationPicker
                                        selectedLocation={
                                            selectedTask?.location
                                        }
                                        disabled
                                    />
                                </View>
                            </View>
                        </View>
                    )}
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
                <RejectTaskModal
                    showInnerModal={showInnerModal}
                    closeInnerModal={closeInnerModal}
                    handleSubmit={handleSubmit}
                />
            )}

            {calendarPermissionNeeded && (
                <CalendarPermissionModal
                    calendarPermissionNeeded={calendarPermissionNeeded}
                    setCalendarPermissionNeeded={setCalendarPermissionNeeded}
                />
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
    }
});

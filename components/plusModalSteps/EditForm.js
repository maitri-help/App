import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    Linking
} from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import EditIcon from '../../assets/icons/edit-icon.svg';
import CheckIcon from '../../assets/icons/check-icon.svg';
import CloseIcon from '../../assets/icons/close-icon.svg';
import CalendarIcon from '../../assets/icons/calendar-icon.svg';
import LocationPicker from './LocationPicker';
import { updateTask, deleteTask } from '../../hooks/api';
import { getAccessToken } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { ScrollView } from 'react-native-gesture-handler';
import * as Calendar from 'expo-calendar';
import { circles } from '../../constants/variables';
import { generateDateString, mergeDateAndTime } from '../../helpers/date';
import {
    getSelectedCircles,
    sortTasksByStartDate
} from '../../helpers/task.helpers';
import { useTask } from '../../context/TaskContext';
import CalendarPermissionModal from '../Modals/CalendarPermissionModal';
import { createCalendarEvent } from '../../helpers/calendar.helper';

export default function EditForm({
    currentStep,
    setCurrentStep,
    onBack,
    setReviewFormCurrentStep,
    onClose,
    isEditable,
    setIsEditable,
    task,
    setTask
}) {
    const toast = useToast();

    const [confirmationVisible, setConfirmationVisible] = useState(false);

    const { setTasks } = useTask();

    const handleCancel = () => {
        setConfirmationVisible(false);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleDateTime = () => {
        setReviewFormCurrentStep(currentStep);
        setCurrentStep(4);
    };

    const toggleEditable = () => {
        setIsEditable(!isEditable);
    };
    const handleSelectOption = (option) => {
        const updatedCircles = getSelectedCircles(task, option);

        setTask((prev) => ({ ...prev, circles: updatedCircles }));
    };

    const handleSubmit = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            const taskData = {
                title: task?.title,
                description: task?.description,
                circles: task?.circles,
                location: task?.location,
                startDate: task?.startDate,
                startTime: task?.startTime,
                endDate: task?.endDate,
                endTime: task?.endTime,
                assigneeId: task?.assignedUserId,
                status: task?.status,
                category: task?.category
            };

            const res = await updateTask(task?.taskId, taskData, accessToken);

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

            toast.show('Task updated successfully', { type: 'success' });

            onClose();

            setIsEditable(!isEditable);
        } catch (error) {
            console.error('Error updating task:', error.response.data.message);

            toast.show('Unsuccessful task update', { type: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            await deleteTask(task?.taskId, accessToken);

            setTasks((prev) => prev.filter((t) => t.taskId !== task?.taskId));

            toast.show('Task deleted successfully', { type: 'success' });

            handleCancel();
            onClose();
        } catch (error) {
            console.error('Error deleting task:', error);

            toast.show('Unsuccessful task deletion', { type: 'error' });
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
        <>
            <View style={[styles.modalTopNav, stylesReview.modalTopNav]}>
                <View style={stylesReview.modalTopNavLeft}>
                    <TouchableOpacity
                        onPress={onClose ? onClose : handleBack}
                        style={[styles.backLinkInline]}
                    >
                        <ArrowLeftIcon
                            width={18}
                            height={18}
                            style={styles.backLinkIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={[stylesReview.field, stylesReview.fieldTask]}
                        placeholder="Task name"
                        placeholderTextColor="#737373"
                        onChangeText={(text) =>
                            setTask((prev) => ({ ...prev, title: text }))
                        }
                        value={task?.title}
                        editable={isEditable}
                    />
                </View>

                <View style={stylesReview.icons}>
                    <TouchableOpacity
                        style={stylesReview.deleteIconWrapper}
                        onPress={() => setConfirmationVisible(true)}
                    >
                        <CloseIcon
                            width={20}
                            height={20}
                            color={'#FF7070'}
                            style={stylesReview.deleteIcon}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={stylesReview.editIconWrapper}
                        onPress={toggleEditable}
                    >
                        {isEditable ? (
                            <CheckIcon
                                width={22}
                                height={22}
                                color={'#000'}
                                style={stylesReview.checkIcon}
                            />
                        ) : (
                            <EditIcon
                                width={22}
                                height={22}
                                color={'#000'}
                                style={stylesReview.editIcon}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={[styles.contentContainer, stylesReview.topDescription]}
            >
                <View style={stylesReview.topDescription}>
                    <TextInput
                        style={stylesReview.field}
                        multiline
                        placeholder="Description"
                        placeholderTextColor="#737373"
                        onChangeText={(text) =>
                            setTask((prev) => ({ ...prev, description: text }))
                        }
                        value={task?.description}
                        editable={isEditable}
                    />
                </View>
            </View>
            <ScrollView>
                {/* <SelectCircles task={task} setTask={setTask} /> */}
                <View style={[stylesReview.group, stylesReview.groupFirst]}>
                    <View
                        style={[
                            styles.contentContainer,
                            stylesReview.groupInner
                        ]}
                    >
                        <Text style={stylesReview.groupTitle}>Circles</Text>
                        <View style={stylesReview.circles}>
                            {circles.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        stylesReview.circle,
                                        !isEditable &&
                                        !task?.circles?.includes(option)
                                            ? stylesReview.circleHidden
                                            : '',
                                        task?.circles?.includes(option) &&
                                            stylesReview.circleSelected
                                    ]}
                                    onPress={() => handleSelectOption(option)}
                                    disabled={!isEditable}
                                >
                                    <Text
                                        style={[
                                            stylesReview.circleText,
                                            task?.circles?.includes(option) &&
                                                stylesReview.circleTextSelected
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={stylesReview.group}>
                    <View
                        style={[
                            styles.contentContainer,
                            stylesReview.groupInner
                        ]}
                    >
                        <Text style={stylesReview.groupTitle}>Date & Time</Text>
                        <TouchableOpacity
                            onPress={handleDateTime}
                            style={stylesReview.fieldLink}
                            disabled={!isEditable}
                        >
                            <Text
                                style={[
                                    stylesReview.fieldText,
                                    isEditable && stylesReview.fieldLinkText
                                ]}
                            >
                                {task?.startDate
                                    ? generateDateString(
                                          task?.startDate,
                                          task?.endDate,
                                          task?.startTime,
                                          task?.endTime
                                      )
                                    : 'Fill time and date'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={stylesReview.group}>
                    <View
                        style={[
                            styles.contentContainer,
                            stylesReview.groupInner
                        ]}
                    >
                        <Text style={stylesReview.groupTitle}>Location </Text>
                        <LocationPicker
                            onSelect={setTask}
                            selectedLocation={task?.location}
                            disabled={!isEditable}
                        />
                    </View>
                </View>
                <View style={stylesReview.group}>
                    <View
                        style={[
                            styles.contentContainer,
                            stylesReview.groupInner
                        ]}
                    >
                        <Text style={stylesReview.groupTitle}>Assignee</Text>
                        {task?.assignee?.firstName &&
                            task?.assignee?.lastName && (
                                <View style={stylesReview.assignee}>
                                    <View
                                        style={[
                                            stylesReview.emojiWrapper,
                                            {
                                                borderColor:
                                                    task?.assignee?.color
                                            }
                                        ]}
                                    >
                                        <Text style={stylesReview.emoji}>
                                            {task?.assignee?.emoji}
                                        </Text>
                                    </View>

                                    <View style={stylesReview.nameWrapper}>
                                        <Text style={stylesReview.name}>
                                            {task?.assignee?.firstName}{' '}
                                            {task?.assignee?.lastName}
                                        </Text>
                                    </View>
                                </View>
                            )}
                    </View>
                </View>
                {isEditable && (
                    <View style={styles.contentContainer}>
                        <View
                            style={[
                                styles.submitButtonContainer,
                                stylesReview.submitButtonContainer
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                            >
                                <ArrowIcon
                                    width={18}
                                    height={18}
                                    color={'#fff'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {!isEditable && (
                    <View style={styles.contentContainer}>
                        <View style={stylesReview.calendarButtonContainer}>
                            <TouchableOpacity
                                style={stylesReview.calendarButton}
                                onPress={handleOpenCalendar}
                            >
                                <Text style={stylesReview.calendarButtonText}>
                                    Export To My Calendar
                                </Text>
                                <CalendarIcon
                                    width={25}
                                    height={25}
                                    color={'#fff'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
            {confirmationVisible && (
                <Modal
                    visible={confirmationVisible}
                    animationType="fade"
                    onRequestClose={handleCancel}
                    transparent
                >
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={stylesReview.innerModalContainer}
                    >
                        <View style={stylesReview.innerModalContent}>
                            <View style={stylesReview.innerModalTexts}>
                                <Text style={stylesReview.innerModalTitle}>
                                    Are you sure you want to delete this task?
                                </Text>
                            </View>
                            <View style={stylesReview.innerModalButtons}>
                                <TouchableOpacity
                                    style={[
                                        stylesReview.innerModalButton,
                                        stylesReview.innerModalButtonRed
                                    ]}
                                    onPress={handleDelete}
                                >
                                    <Text
                                        style={[
                                            stylesReview.innerModalButtonText,
                                            stylesReview.innerModalButtonRedText
                                        ]}
                                    >
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        stylesReview.innerModalButton,
                                        stylesReview.innerModalButtonWhite
                                    ]}
                                    onPress={handleCancel}
                                >
                                    <Text
                                        style={[
                                            stylesReview.innerModalButtonText,
                                            stylesReview.innerModalButtonWhiteText
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
                <CalendarPermissionModal
                    calendarPermissionNeeded={calendarPermissionNeeded}
                    setCalendarPermissionNeeded={setCalendarPermissionNeeded}
                />
            )}
        </>
    );
}

const stylesReview = StyleSheet.create({
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
    fieldLink: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexShrink: 1,
        flexGrow: 1
    },
    fieldText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000'
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline'
    },
    circles: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        flexShrink: 1,
        flexGrow: 1,
        margin: -3
    },
    circle: {
        paddingHorizontal: 11,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        margin: 3
    },
    circleSelected: {
        backgroundColor: '#1C4837'
    },
    circleHidden: {
        display: 'none'
    },
    circleText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16
    },
    circleTextSelected: {
        color: '#fff'
    },
    assignee: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    emojiWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emoji: {
        fontSize: Platform.OS === 'android' ? 24 : 28,
        textAlign: 'center'
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
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 10
    },
    groupTitle: {
        color: '#9F9F9F',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
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
    },
    calendarButtonContainer: {
        marginTop: 70,
        marginHorizontal: 15
    },
    calendarButton: {
        backgroundColor: '#1C4837',
        paddingVertical: 20,
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

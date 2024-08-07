import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import LocationPicker from './LocationPicker';
import { assingUserToTask } from '../../hooks/api';
import { getAccessToken } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';
import Modal from '../Modal';
import Button from '../Button';
import { ScrollView } from 'react-native-gesture-handler';
import { generateDateString } from '../../helpers/date';
import { useTask } from '../../context/TaskContext';
import { sortTasksByStartDate } from '../../helpers/task.helpers';
import { LARGE_FONT_SCALE, SMALL_SCREEN_HEIGHT } from '../../constants/variables';

export default function TaskDetailsModal({ visible, selectedTask, onClose }) {
    const toast = useToast();

    const { height } = Dimensions.get('window');
    const fontScale = PixelRatio.getFontScale();
    const isAndroid = Platform.OS === 'android';

    const { setTasks } = useTask();

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

            const res = await assingUserToTask(
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

            toast.show('Assigned to task successfully', { type: 'success' });

            onClose();
        } catch (error) {
            console.error('Error updating task:', error);

            toast.show('Unsuccessful task assign', { type: 'error' });
        }
    };

    return (
        <Modal visible={visible} onClose={onClose} style={stylesModal}>
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
                        (isAndroid && height > SMALL_SCREEN_HEIGHT) || (!isAndroid && fontScale < LARGE_FONT_SCALE) && stylesModal.topDescription
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
                                    {generateDateString(
                                        selectedTask?.startDate,
                                        selectedTask?.endDate,
                                        selectedTask?.startTime,
                                        selectedTask?.endTime
                                    )}
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

            <View
                style={[
                    styles.contentContainer,
                    (isAndroid && height < SMALL_SCREEN_HEIGHT) || (!isAndroid && fontScale > LARGE_FONT_SCALE) ? { marginVertical: 20 } : { marginTop: 40, marginBottom: 60 }
                ]}
            >
                <Button title="I'm In!" onPress={handleSubmit} />
            </View>
        </Modal>
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
    }
});

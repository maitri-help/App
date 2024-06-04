import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import LocationPicker from './LocationPicker';
import { createTask } from '../../hooks/api';
import { getAccessToken } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { generateDateString } from '../../helpers/date';
import SelectCircles from './SelectCircles';

export default function FormFields({
    selectedService,
    currentStep,
    setCurrentStep,
    onBack,
    onClose,
    onTaskCreated,
    task,
    setTask,
    deviceLocation
}) {
    const toast = useToast();

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleDateTime = () => {
        setCurrentStep(4);
    };

    const handleSubmit = async () => {
        const taskData = { ...task, category: selectedService.title };

        if (!task?.title || !task?.startDate) {
            toast.show('Task name and start date are required.', {
                type: 'error'
            });
            return;
        }
        const isSameDay = +new Date(task.startDate) === +new Date(task.endDate);
        if (isSameDay) {
            if (task.startTime > task.endTime) {
                toast.show('End time must be after start time.', {
                    type: 'error'
                });
                return;
            }
        }

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            const res = await createTask(taskData, accessToken);

            toast.show('Task created successfully', { type: 'success' });

            onClose();

            onTaskCreated();
        } catch (error) {
            console.error('Error creating task:', error);

            if (error.response && error.response.status === 400) {
                toast.show('Error creating task. Please try again.', {
                    type: 'error'
                });
            } else {
                toast.show('Unsuccessful task creation', { type: 'error' });
            }
        }
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesFields.modalTopNav]}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={[styles.backLinkInline]}
                >
                    <ArrowLeftIcon
                        width={18}
                        height={18}
                        style={styles.backLinkIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, stylesFields.topBarTitle]}>
                    {selectedService.title}
                </Text>
            </View>
            <ScrollView
                automaticallyAdjustKeyboardInsets={true}
                keyboardShouldPersistTaps="handled"
            >
                <View
                    style={[styles.contentContainer, stylesFields.fieldsList]}
                >
                    <View style={stylesFields.fieldsListInner}>
                        <View
                            style={[
                                stylesFields.fieldGroup,
                                stylesFields.fieldGroupFirst
                            ]}
                        >
                            <TextInput
                                style={[
                                    stylesFields.field,
                                    stylesFields.fieldTask
                                ]}
                                placeholder="Task name"
                                placeholderTextColor="#737373"
                                onChangeText={(text) =>
                                    setTask({ ...task, title: text })
                                }
                                value={task?.title}
                            />
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <TextInput
                                style={stylesFields.field}
                                multiline
                                placeholder="Description"
                                placeholderTextColor="#737373"
                                onChangeText={(text) =>
                                    setTask({ ...task, description: text })
                                }
                                value={task?.description}
                            />
                        </View>
                        <SelectCircles task={task} setTask={setTask} />

                        <View style={stylesFields.fieldGroup}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel}>
                                    Date & Time
                                </Text>
                                <TouchableOpacity
                                    onPress={handleDateTime}
                                    style={stylesFields.fieldLink}
                                >
                                    <Text style={stylesFields.fieldLinkText}>
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
                        <View
                            style={[
                                stylesFields.fieldGroup,
                                stylesFields.fieldGroupLast
                            ]}
                        >
                            <View style={stylesFields.fieldGroupInner}>
                                <Text
                                    style={stylesFields.fieldLabel}
                                    numberOfLines={1}
                                >
                                    Location
                                </Text>
                                <LocationPicker
                                    onSelect={setTask}
                                    selectedLocation={task?.location}
                                    deviceLocation={deviceLocation}
                                />
                            </View>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.submitButtonContainer,
                            stylesFields.submitButtonContainer
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <ArrowIcon width={18} height={18} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const stylesFields = StyleSheet.create({
    topBarTitle: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#787878'
    },
    fieldGroup: {
        paddingVertical: 15,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1
    },
    fieldGroupFirst: {
        borderBottomWidth: 0,
        paddingTop: 0
    },
    fieldGroupLast: {
        borderBottomWidth: 0
    },
    fieldGroupInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 10
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
    fieldLabel: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'poppins-regular',
        color: '#000'
    },
    fieldTask: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'poppins-medium'
    },
    fieldLink: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexShrink: 1,
        flexGrow: 1
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline'
    },

    submitButtonContainer: {
        paddingTop: 10
    }
});

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import { useToast } from 'react-native-toast-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CALENDAR_THEME_SETTINGS } from '../../constants/calendar';
import { formatDate, getDaysBetween } from '../../helpers/date';

export default function DateTime({
    currentStep,
    setCurrentStep,
    onBack,
    reviewFormCurrentStep,
    task,
    setTask
}) {
    const [isStartTimePickerVisible, setStartTimePickerVisible] =
        useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const toast = useToast();

    const formattedStartDate = task?.startDate
        ? task.startDate.split('T')[0]
        : null;
    const formattedEndDate = task?.endDate ? task.endDate.split('T')[0] : null;

    useEffect(() => {
        setMarkedDates({
            [formattedStartDate]: {
                startingDay: true,
                color: '#1C4837',
                textColor: '#fff',
                ...(formattedStartDate === formattedEndDate && {
                    endingDay: true
                })
            },
            [formattedEndDate]: {
                endingDay: true,
                color: '#1C4837',
                textColor: '#fff',
                ...(formattedStartDate === formattedEndDate && {
                    startingDay: true
                })
            },
            ...getDaysBetween(formattedStartDate, formattedEndDate)
        });
    }, [task]);

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleStartTimeConfirm = (_, time) => {
        const formattedTime = formatDate(time, { formatString: 'HH:mm' });
        setStartTimePickerVisible(false);
        setTask((prev) => ({ ...prev, startTime: formattedTime }));
    };

    const handleEndTimeConfirm = (_, time) => {
        const formattedTime = formatDate(time, { formatString: 'HH:mm' });
        setEndTimePickerVisible(false);
        setTask((prev) => ({ ...prev, endTime: formattedTime }));
    };

    const handleDayPress = (day) => {
        const date = new Date(day.dateString).toISOString();
        if (task?.startDate && task?.endDate) {
            setTask((prev) => ({
                ...prev,
                startDate: date,
                endDate: null
            }));
        } else if (task?.startDate && !task?.endDate) {
            const endDate = date;
            setTask((prev) => ({
                ...prev,
                endDate
            }));
            if (new Date(task.startDate) <= new Date(endDate)) {
                setTask((prev) => ({
                    ...prev,
                    endDate: date
                }));
            } else {
                setTask((prev) => ({
                    ...prev,
                    startDate: date,
                    endDate: null
                }));
            }
        } else {
            setTask((prev) => ({
                ...prev,
                startDate: date
            }));
        }
    };

    const handleDateTimeSelect = () => {
        if (!task?.startDate) {
            toast.show('Please select a start date', { type: 'error' });
        } else {
            reviewFormCurrentStep === 5
                ? setCurrentStep(5)
                : setCurrentStep(currentStep - 1);
        }
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesDate.modalTopNav]}>
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
                <Text style={[styles.topBarTitle, stylesDate.topBarTitle]}>
                    {task?.title}
                </Text>
            </View>
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesDate.fieldsList]}>
                    <View style={stylesDate.label}>
                        <Text style={stylesDate.labelText}>Date</Text>
                    </View>
                    <View style={stylesDate.calendarWrapper}>
                        <Calendar
                            style={stylesDate.calendar}
                            firstDay={1}
                            onDayPress={handleDayPress}
                            markedDates={markedDates}
                            markingType={'period'}
                            minDate={new Date().toISOString()}
                            disableAllTouchEventsForDisabledDays={true}
                            theme={CALENDAR_THEME_SETTINGS}
                        />
                    </View>
                    <View style={stylesDate.fieldGroup}>
                        <View style={stylesDate.fieldGroupInner}>
                            <Text
                                style={stylesDate.fieldLabel}
                                numberOfLines={1}
                            >
                                Starts
                            </Text>
                            <TouchableOpacity
                                onPress={() => setStartTimePickerVisible(true)}
                            >
                                <Text style={stylesDate.field}>
                                    {task?.startTime
                                        ? task.startTime
                                        : 'Select Start Time'}
                                </Text>
                            </TouchableOpacity>

                            {isStartTimePickerVisible && (
                                <DateTimePicker
                                    mode="time"
                                    testID="startDateTimePicker"
                                    value={
                                        task?.startTime
                                            ? new Date(task?.startTime)
                                            : new Date()
                                    }
                                    themeVariant="light"
                                    onChange={handleStartTimeConfirm}
                                />
                            )}
                        </View>
                    </View>
                    <View style={stylesDate.fieldGroup}>
                        <View style={stylesDate.fieldGroupInner}>
                            <Text
                                style={stylesDate.fieldLabel}
                                numberOfLines={1}
                            >
                                Ends
                            </Text>
                            <TouchableOpacity
                                onPress={() => setEndTimePickerVisible(true)}
                            >
                                <Text style={stylesDate.field}>
                                    {task?.endTime
                                        ? task.endTime
                                        : 'Select End Time'}
                                </Text>
                            </TouchableOpacity>
                            {isEndTimePickerVisible && (
                                <DateTimePicker
                                    mode="time"
                                    testID="endDateTimePicker"
                                    value={
                                        task?.endTime
                                            ? new Date(task?.endTime)
                                            : new Date()
                                    }
                                    themeVariant="light"
                                    onChange={handleEndTimeConfirm}
                                />
                            )}
                        </View>
                    </View>
                    <View
                        style={[
                            styles.submitButtonContainer,
                            stylesDate.submitButtonContainer
                        ]}
                    >
                        <TouchableOpacity
                            onPress={handleDateTimeSelect}
                            style={styles.submitButton}
                        >
                            <ArrowIcon width={18} height={18} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const stylesDate = StyleSheet.create({
    topBarTitle: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#787878'
    },
    label: {
        marginBottom: 10
    },
    labelText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'poppins-medium',
        color: '#787878'
    },
    calendarWrapper: {
        marginBottom: 15
    },
    calendar: {
        minWidth: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.0,
        elevation: 14,
        paddingBottom: 8
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
        gap: 15
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
    submitButtonContainer: {
        paddingTop: 30
    }
});

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';

export default function DateTime({ currentStep, setCurrentStep, taskName, setTaskName, onBack, onDateTimeSelect, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, handleDayPress, getDaysBetween, reviewFormCurrentStep }) {
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleStartTimeConfirm = (time) => {
        setStartTime(time);
        setStartTimePickerVisible(false);
    };

    const handleEndTimeConfirm = (time) => {
        setEndTime(time);
        setEndTimePickerVisible(false);
    };

    const showStartTimePicker = () => {
        setStartTimePickerVisible(true);
    };

    const showEndTimePicker = () => {
        setEndTimePickerVisible(true);
    };

    const hideStartTimePicker = () => {
        setStartTimePickerVisible(false);
    };

    const hideEndTimePicker = () => {
        setEndTimePickerVisible(false);
    }

    useEffect(() => {
        setStartDate(new Date().setHours(0, 0, 0, 0));
        setEndDate(new Date().setHours(0, 0, 0, 0));
    }, []);

    const handleDateTimeSelect = () => {
        if (startDate && endDate && startTime && endTime) {
            const startDateTime = new Date(startDate);
            startDateTime.setHours(new Date(startTime).getHours(), new Date(startTime).getMinutes());
            const endDateTime = new Date(endDate);
            endDateTime.setHours(new Date(endTime).getHours(), new Date(endTime).getMinutes());

            onDateTimeSelect({ startDateTime, endDateTime });

            { reviewFormCurrentStep === 5 ? setCurrentStep(5) : setCurrentStep(currentStep - 1) }

        } else {
            console.log('Please select both start and end date and time');
        }
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesDate.modalTopNav]}>
                <TouchableOpacity onPress={handleBack} style={[styles.backLinkInline]}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, stylesDate.topBarTitle]}>
                    {taskName}
                </Text>
            </View>
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesDate.fieldsList]}>
                    <View style={stylesDate.label}>
                        <Text style={stylesDate.labelText}>
                            Date
                        </Text>
                    </View>
                    <View style={stylesDate.calendarWrapper}>
                        <Calendar
                            style={stylesDate.calendar}
                            firstDay={1}
                            onDayPress={handleDayPress}
                            markedDates={{
                                [startDate]: { startingDay: true, color: '#1C4837', textColor: '#fff', ...(startDate === endDate && { endingDay: true, }) },
                                [endDate]: { endingDay: true, color: '#1C4837', textColor: '#fff', ...(startDate === endDate && { startingDay: true, }) },
                                ...getDaysBetween(startDate, endDate)
                            }}
                            markingType={'period'}
                            theme={{
                                textDayFontFamily: 'poppins-regular',
                                textMonthFontFamily: 'poppins-medium',
                                textDayHeaderFontFamily: 'poppins-regular',
                                textDayFontSize: 14,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 12,
                                textDayFontColor: '#000',
                                textMonthFontColor: '#000',
                                textSectionTitleColor: '#A4A4A4',
                                arrowColor: '#000',
                                todayTextColor: '#000',
                                selectedDayTextColor: '#fff',
                                selectedDayBackgroundColor: '#1C4837',
                                textDisabledColor: '#A4A4A4',
                                weekVerticalMargin: 1,
                                'stylesheet.calendar.header': {
                                    header: {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: -5,
                                    },
                                },
                            }}
                        />
                    </View>
                    <View style={stylesDate.fieldGroup}>
                        <View style={stylesDate.fieldGroupInner}>
                            <Text style={stylesDate.fieldLabel} numberOfLines={1}>
                                Starts
                            </Text>
                            <TouchableOpacity onPress={showStartTimePicker}>
                                <Text style={stylesDate.field}>
                                    {startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Select Start Time'}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                mode="time"
                                isVisible={isStartTimePickerVisible}
                                onConfirm={handleStartTimeConfirm}
                                onCancel={hideStartTimePicker}
                            />
                        </View>
                    </View>
                    <View style={stylesDate.fieldGroup}>
                        <View style={stylesDate.fieldGroupInner}>
                            <Text style={stylesDate.fieldLabel} numberOfLines={1}>
                                Ends
                            </Text>
                            <TouchableOpacity onPress={showEndTimePicker}>
                                <Text style={stylesDate.field}>
                                    {endTime ? new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Select End Time'}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                mode="time"
                                isVisible={isEndTimePickerVisible}
                                onConfirm={handleEndTimeConfirm}
                                onCancel={hideEndTimePicker}
                            />
                        </View>
                    </View>
                    <View style={[styles.submitButtonContainer, stylesDate.submitButtonContainer]}>
                        <TouchableOpacity onPress={handleDateTimeSelect} style={styles.submitButton} >
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
        color: '#787878',
    },
    label: {
        marginBottom: 10,
    },
    labelText: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'poppins-medium',
        color: '#787878',
    },
    calendarWrapper: {
        marginBottom: 15,
    },
    calendar: {
        minWidth: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.00,
        elevation: 14,
        paddingBottom: 8,
    },
    fieldGroup: {
        paddingVertical: 15,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    fieldGroupFirst: {
        borderBottomWidth: 0,
        paddingTop: 0
    },
    fieldGroupLast: {
        borderBottomWidth: 0,
    },
    fieldGroupInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 1,
        gap: 15,
    },
    field: {
        borderWidth: 0,
        padding: 0,
        margin: 0,
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000',
        flexShrink: 1,
    },
    fieldLabel: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'poppins-regular',
        color: '#000',
    },
    submitButtonContainer: {
        paddingTop: 30,
    }
});
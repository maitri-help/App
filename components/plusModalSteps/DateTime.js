import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';

export default function DateTime({ currentStep, setCurrentStep, taskName, onBack, onDateTimeSelect, startDate: propStartDate, startTime: propStartTime, endDate: propEndDate, endTime: propEndTime, setStartTime, setEndTime, handleDayPress, getDaysBetween, reviewFormCurrentStep }) {
    const [startDate, setStartDateLocal] = useState(propStartDate !== null ? propStartDate : null);
    const [endDate, setEndDateLocal] = useState(propEndDate !== null ? propEndDate : null);
    const [startTime, setStartTimeLocal] = useState(propStartTime !== null ? propStartTime : null);
    const [endTime, setEndTimeLocal] = useState(propEndTime !== null ? propEndTime : null);
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        if (propStartDate) {
            setStartDateLocal(propStartDate);
        }
        if (propEndDate) {
            setEndDateLocal(propEndDate);
        }
        if (propStartTime) {
            setStartTimeLocal(propStartTime);
        }
        if (propEndTime) {
            setEndTimeLocal(propEndTime);
        }
    }, [propStartDate, propEndDate, propStartTime, propEndTime]);

    const formattedStartDate = startDate ? startDate.split('T')[0] : null;
    const formattedEndDate = endDate ? endDate.split('T')[0] : null;

    useEffect(() => {
        setMarkedDates({
            [formattedStartDate]: { startingDay: true, color: '#1C4837', textColor: '#fff', ...(formattedStartDate === formattedEndDate && { endingDay: true, }) },
            [formattedEndDate]: { endingDay: true, color: '#1C4837', textColor: '#fff', ...(formattedStartDate === formattedEndDate && { startingDay: true, }) },
            ...getDaysBetween(formattedStartDate, formattedEndDate)
        });
    }, [startDate, endDate]);

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleStartTimeConfirm = (time) => {
        const currentDate = startDate ? new Date(startDate) : new Date();
        const updatedDateTime = new Date(currentDate.setHours(time.getHours(), time.getMinutes()));
        setStartTime(updatedDateTime.toISOString());
        setStartTimePickerVisible(false);
    };

    const handleEndTimeConfirm = (time) => {
        const currentDate = endDate ? new Date(endDate) : new Date();
        const updatedDateTime = new Date(currentDate.setHours(time.getHours(), time.getMinutes()));
        setEndTime(updatedDateTime.toISOString());
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
    };

    useEffect(() => {
        if (propStartDate) {
            setStartDateLocal(propStartDate);
        }
        if (propEndDate) {
            setEndDateLocal(propEndDate);
        }
    }, [propStartDate, propEndDate]);

    const handleDateTimeSelect = () => {
        if (startDate) {
            const formattedStartDateTime = new Date(startDate).toISOString();
            const formattedEndDateTime = endDate ? new Date(endDate).toISOString() : null;

            onDateTimeSelect({ startDateTime: formattedStartDateTime, endDateTime: formattedEndDateTime });
            reviewFormCurrentStep === 5 ? setCurrentStep(5) : setCurrentStep(currentStep - 1);
        } else {
            console.log('Please select a start date');
        }
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesDate.modalTopNav]}>
                <TouchableOpacity onPress={handleBack} style={[styles.backLinkInline]}>
                    <ArrowLeftIcon width={18} height={18} style={styles.backLinkIcon} />
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
                            markedDates={markedDates}
                            markingType={'period'}
                            minDate={new Date().toISOString()}
                            disableAllTouchEventsForDisabledDays={true}
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

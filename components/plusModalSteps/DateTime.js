import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import GridCalendar, { monthNum } from '../calendar/GridCalendar';

export default function DateTime({ currentStep, setCurrentStep, taskName, setTaskName, onSubmit, onBack, setDate, selectedDate, currentYearProp, currentMonthProp, setCurrentYear, setCurrentMonth, setWeekStartDate, }) {

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
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
                    <View style={stylesDate.calendar}>
                        <GridCalendar
                            setDate={setDate}
                            selectedDate={selectedDate}
                            currentYearProp={currentYearProp}
                            currentMonthProp={currentMonthProp}
                            setCurrentYear={setCurrentYear}
                            setCurrentMonth={setCurrentMonth}
                            setWeekStartDate={setWeekStartDate}
                        />
                    </View>
                    <View style={stylesDate.fieldGroup}>
                        <View style={stylesDate.fieldGroupInner}>
                            <Text style={stylesDate.fieldLabel} numberOfLines={1}>
                                Starts
                            </Text>
                            <TextInput
                                style={stylesDate.field}
                                multiline
                                placeholder="Start time"
                                placeholderTextColor="#787878"
                            />
                        </View>
                    </View>
                    <View style={stylesDate.fieldGroup}>
                        <View style={stylesDate.fieldGroupInner}>
                            <Text style={stylesDate.fieldLabel} numberOfLines={1}>
                                Ends
                            </Text>
                            <TextInput
                                style={stylesDate.field}
                                multiline
                                placeholder="End time"
                                placeholderTextColor="#787878"
                            />
                        </View>
                    </View>
                    <View style={[styles.submitButtonContainer, stylesDate.submitButtonContainer]}>
                        <TouchableOpacity onPress={onSubmit} style={styles.submitButton} >
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
    calendar: {
        marginBottom: -10,
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
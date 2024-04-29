import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import LocationPicker from './LocationPicker';
import { createTask } from '../../hooks/api';
import { getAccessToken } from '../../authStorage';

export default function FormFields({ selectedService, currentStep, setCurrentStep, taskName, setTaskName, onBack, circles, selectedCircle, setSelectedCircle, description, setDescription, selectedLocation, setSelectedLocation, dateTimeData }) {

    const [dateTimeText, setDateTimeText] = useState('Fill time and date');

    useEffect(() => {
        if (!Array.isArray(selectedCircle)) {
            setSelectedCircle(['Personal']);
        }
    }, []);

    const handleSelectOption = (option) => {
        let updatedCircles;

        if (option === 'Personal') {
            updatedCircles = [option];
        } else if (selectedCircle.includes('Personal')) {
            updatedCircles = [option];
        } else {
            if (selectedCircle.includes(option)) {
                updatedCircles = selectedCircle.filter(item => item !== option);
            } else {
                updatedCircles = [...selectedCircle, option];
            }
        }

        setSelectedCircle(updatedCircles);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleDateTime = () => {
        setCurrentStep(4);
    };

    useEffect(() => {
        if (dateTimeData) {
            setDateTimeText(formatDateTime(dateTimeData));
        }
    }, [dateTimeData]);

    const formatDateTime = (dateTimeData) => {
        const { startDateTime, endDateTime } = dateTimeData;
        const formattedStartDateTime = formatDate(startDateTime);
        const formattedEndDateTime = formatDate(endDateTime);
        return `${formattedStartDateTime} - ${formattedEndDateTime}`;
    };

    const formatDate = (date) => {
        const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const handleSubmit = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            const locationString = `${selectedLocation.latitude},${selectedLocation.longitude}`;

            const startDateTimeString = dateTimeData.startDateTime.toISOString();
            const endDateTimeString = dateTimeData.endDateTime.toISOString();

            const taskData = {
                title: taskName,
                description: description,
                circles: selectedCircle,
                location: locationString,
                startDateTime: startDateTimeString,
                endDateTime: endDateTimeString,
                assigneeId: null
            };

            console.log("Task data:", taskData);

            const response = await createTask(taskData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            console.log("Task created successfully:", response.data);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };
    return (
        <>
            <View style={[styles.modalTopNav, stylesFields.modalTopNav]}>
                <TouchableOpacity onPress={handleBack} style={[styles.backLinkInline]}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, stylesFields.topBarTitle]}>
                    {selectedService.title}
                </Text>
            </View>
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesFields.fieldsList]}>
                    <View style={stylesFields.fieldsListInner}>
                        <View style={[stylesFields.fieldGroup, stylesFields.fieldGroupFirst]}>
                            <TextInput
                                style={[stylesFields.field, stylesFields.fieldTask]}
                                placeholder="Task name"
                                placeholderTextColor="#737373"
                                onChangeText={setTaskName}
                                value={taskName}
                            />
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <TextInput
                                style={stylesFields.field}
                                multiline
                                placeholder="Description"
                                placeholderTextColor="#737373"
                                onChangeText={setDescription}
                                value={description}
                            />
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel}>
                                    Circles
                                </Text>

                                <View style={stylesFields.circleItems}>
                                    {circles.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                stylesFields.circleItem,
                                                selectedCircle.includes(option) && stylesFields.circleItemSelected
                                            ]}
                                            onPress={() => handleSelectOption(option)}
                                        >
                                            <Text style={[stylesFields.circleItemText, selectedCircle.includes(option) && stylesFields.circleItemTextSelected]}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <Text style={stylesFields.fieldDescription}>
                                Supporter will only see tasks in their circle
                            </Text>
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel}>
                                    Date & Time
                                </Text>
                                <TouchableOpacity onPress={handleDateTime} style={stylesFields.fieldLink}>
                                    <Text style={stylesFields.fieldLinkText}>
                                        {dateTimeText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[stylesFields.fieldGroup, stylesFields.fieldGroupLast]}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel} numberOfLines={1}>
                                    Location
                                </Text>
                                <LocationPicker onSelect={setSelectedLocation} selectedLocation={selectedLocation} />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.submitButtonContainer, stylesFields.submitButtonContainer]}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <ArrowIcon width={18} height={18} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const stylesFields = StyleSheet.create({
    topBarTitle: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#787878',
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
        flexWrap: 'wrap',
        gap: 10,
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
    fieldTask: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'poppins-medium',
    },
    fieldLink: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexShrink: 1,
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline',
    },
    fieldDescription: {
        color: '#737373',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'poppins-regular',
        textAlign: 'center',
        paddingTop: 20,
    },
    submitButtonContainer: {
        paddingTop: 10,
    },
    circleItems: {
        flexDirection: 'row',
        gap: 7,
    },
    circleItem: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    circleItemSelected: {
        backgroundColor: '#1C4837',
    },
    circleItemText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
    },
    circleItemTextSelected: {
        color: '#fff',
    },
});
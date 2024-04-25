import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import EditIcon from '../../assets/icons/edit-icon.svg';
import CheckIcon from '../../assets/icons/check-icon.svg';
import LocationPicker from './LocationPicker';

export default function EditForm({ currentStep, setCurrentStep, taskName, setTaskName, circles, selectedCircle, setSelectedCircle, description, setDescription, selectedLocation, setSelectedLocation, dateTimeData, onBack, setReviewFormCurrentStep, assignees, onClose }) {
    const [dateTimeText, setDateTimeText] = useState('Fill time and date');
    const [isEditable, setIsEditable] = useState(false);

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
        if (option === 'Personal') {
            setSelectedCircle([option]);
        } else if (selectedCircle.includes('Personal')) {
            setSelectedCircle([option]);
        } else {
            if (selectedCircle.includes(option)) {
                setSelectedCircle(selectedCircle.filter(item => item !== option));
            } else {
                setSelectedCircle([...selectedCircle, option]);
            }
        }
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

    const handleSubmit = () => {
        console.log("Task Name:", taskName);
        console.log("Description:", description);
        console.log("Selected Circles:", selectedCircle);
        console.log("Date & Time:", dateTimeData);
        console.log("Selected Location:", selectedLocation);
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesReview.modalTopNav]}>
                <View style={stylesReview.modalTopNavLeft}>
                    <TouchableOpacity onPress={onClose ? onClose : handleBack} style={[styles.backLinkInline]}>
                        <ArrowLeftIcon style={styles.backLinkIcon} />
                    </TouchableOpacity>
                    <TextInput
                        style={[stylesReview.field, stylesReview.fieldTask]}
                        placeholder="Task name"
                        placeholderTextColor="#737373"
                        onChangeText={setTaskName}
                        value={taskName}
                        editable={isEditable}
                    />
                </View>

                <View>
                    <TouchableOpacity style={stylesReview.editIconWrapper} onPress={toggleEditable}>
                        {isEditable ? (
                            <CheckIcon width={22} height={22} color={'#000'} style={stylesReview.checkIcon} />
                        ) : (
                            <EditIcon width={22} height={22} color={'#000'} style={stylesReview.editIcon} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.contentContainer, stylesReview.topDescription]}>
                <View style={stylesReview.topDescription}>
                    <TextInput
                        style={stylesReview.field}
                        multiline
                        placeholder="Description"
                        placeholderTextColor="#737373"
                        onChangeText={setDescription}
                        value={description}
                        editable={isEditable}
                    />
                </View>
            </View>
            <View style={[stylesReview.group, stylesReview.groupFirst]}>
                <View style={[styles.contentContainer, stylesReview.groupInner]}>
                    <Text style={stylesReview.groupTitle}>Circles</Text>
                    <View style={stylesReview.circles}>
                        {circles.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    stylesReview.circle,
                                    !isEditable && !selectedCircle.includes(option) ? stylesReview.circleHidden : '',
                                    selectedCircle.includes(option) && stylesReview.circleSelected
                                ]}
                                onPress={() => handleSelectOption(option)}
                                disabled={!isEditable}
                            >
                                <Text style={[
                                    stylesReview.circleText,
                                    selectedCircle.includes(option) && stylesReview.circleTextSelected
                                ]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
            <View style={stylesReview.group}>
                <View style={[styles.contentContainer, stylesReview.groupInner]}>
                    <Text style={stylesReview.groupTitle}>Date & Time</Text>
                    <TouchableOpacity onPress={handleDateTime} style={stylesReview.fieldLink} disabled={!isEditable}>
                        <Text style={[stylesReview.fielText, isEditable && stylesReview.fieldLinkText]}>
                            {dateTimeText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={stylesReview.group}>
                <View style={[styles.contentContainer, stylesReview.groupInner]}>
                    <Text style={stylesReview.groupTitle}>Location </Text>
                    <LocationPicker onSelect={setSelectedLocation} selectedLocation={selectedLocation} disabled={!isEditable} />
                </View>
            </View>
            <View style={stylesReview.group}>
                <View style={[styles.contentContainer, stylesReview.groupInner]}>
                    <Text style={stylesReview.groupTitle}>Assignee</Text>
                    <View style={stylesReview.assigneesWrapper}>
                        <ScrollView contentContainerStyle={stylesReview.assignees}>
                            {assignees.map((assignee, index) => (
                                <TouchableOpacity style={stylesReview.assignee} key={index}>
                                    <View style={[stylesReview.imageWrapper, { borderColor: assignee.color }]}>
                                        <Image source={assignee.image} style={stylesReview.image} />
                                    </View>

                                    <View style={stylesReview.nameWrapper}>
                                        <Text style={stylesReview.name}>
                                            {assignee.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
            {isEditable &&
                <View style={styles.contentContainer}>
                    <View style={[styles.submitButtonContainer, stylesReview.submitButtonContainer]}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <ArrowIcon width={18} height={18} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </>
    )
}

const stylesReview = StyleSheet.create({
    modalTopNav: {
        justifyContent: 'space-between',
    },
    modalTopNavLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topDescription: {
        marginBottom: 20,
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
    fieldTask: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'poppins-medium',
    },
    fieldLink: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexShrink: 1,
    },
    fielText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000',
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline',
    },
    circles: {
        flexDirection: 'row',
        gap: 8,
    },
    circle: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    circleSelected: {
        backgroundColor: '#1C4837',
    },
    circleHidden: {
        display: 'none',
    },
    circleText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
    },
    circleTextSelected: {
        color: '#fff',
    },
    assigneesWrapper: {
        height: 66,
        marginRight: -10,
    },
    assignees: {
        paddingHorizontal: 10,
    },
    assignee: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    imageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    name: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
    },
    group: {
        paddingVertical: 15,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    groupFirst: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
    },
    groupInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 1,
        gap: 15,
    },
    groupTitle: {
        color: '#9F9F9F',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    },
});
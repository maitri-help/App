import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';
import EditIcon from '../../assets/icons/edit-icon.svg';
import CheckIcon from '../../assets/icons/check-icon.svg';
import LocationPicker from './LocationPicker';
import { updateTask } from '../../hooks/api';
import { getAccessToken } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';
import Modal from '../Modal';
import Button from '../Button';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditFormNoCircle({ currentStep, setCurrentStep, taskName, setTaskName, circles, selectedCircle, setSelectedCircle, description, setDescription, selectedLocation, setSelectedLocation, onBack, setReviewFormCurrentStep, time ,startDateTime, endDateTime, notes, lastName, color, emoji, onClose, isEditable, setIsEditable, taskId, onTaskCreated }) {

    const [dateTimeText, setDateTimeText] = useState(null);
    const toast = useToast();

    useEffect(() => {
        console.log(time);
        if (time) {
            const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
            const Newtime = new Date(time).toLocaleString('en-US', options);
            setDateTimeText(Newtime);
            console.log(Newtime);
        }
    }, [time]);

    const handleDateTime = () => {
        setReviewFormCurrentStep(currentStep);
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

    const handleSubmit = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            console.log(selectedCircle);

            const taskData = {
                title: taskName,
                description: description,
                circles: selectedCircle,
                location: selectedLocation,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
            };

            console.log("Task update data:", taskData);

            const header = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await updateTask(taskData, header, taskId);

            console.log("Task updated successfully:", response.data);

            toast.show('Task updated successfully', { type: 'success' });

            onClose();

            onTaskCreated();

        } catch (error) {
            console.error("Error updating task:", error);

            toast.show('Unsuccessful task update', { type: 'error' });
        }
    };
    return (
        <Modal
        >
            <View style={{maxHeight: 400}}>
                <View style={[styles.modalTopNav, stylesReview.modalTopNav]}>
                    <View style={stylesReview.modalTopNavLeft}>
                        <TouchableOpacity onPress={onClose} style={[styles.backLinkInline]}>
                            <ArrowLeftIcon style={styles.backLinkIcon} />
                        </TouchableOpacity>
                        <Text style={[stylesReview.field, stylesReview.fieldTask]}>
                            {taskName}
                        </Text>
                    </View>

                </View>
                <View style={[styles.contentContainer, stylesReview.topDescription]}>
                    <View style={stylesReview.topDescription}>
                        <Text style={[styles.text]}>{description}</Text>
                    </View>
                </View>
                <View style={stylesReview.group}>
                    <View style={[styles.contentContainer, stylesReview.groupInner]}>
                        <Text style={stylesReview.groupTitle}>Date & Time</Text>
                        <View style={stylesReview.fieldLink}>
                            <Text style={[stylesReview.fielText]}>
                                {dateTimeText}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={stylesReview.group}>
                    <View style={[styles.contentContainer, stylesReview.groupInner]}>
                        <Text style={stylesReview.groupTitle}>Location </Text>
                        <View style={stylesReview.fieldLink}>
                            <Text>
                                <LocationPicker selectedLocation={selectedLocation} disabled={!isEditable}/>
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[stylesReview.group, {borderBottomWidth: 0}]}>
                    <View style={[styles.contentContainer, stylesReview.groupInner]}>
                        <Text style={[stylesReview.groupTitle, {alignSelf: 'flex-start'}]}>Notes </Text>
                        <View style={[stylesReview.fieldLink, stylesReview.taskNotes,{height: 140}]}>
                            <ScrollView>
                                <Text style={[stylesReview.fielText, {textAlign: 'justify'}]}>
                                    {notes}
                                </Text>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
            
            <View style={{width: 300, alignSelf: 'center'}}>
                <Button 
                    textStyle={{ fontSize: 20 }}
                    title="I'm In!" 
                    onPress={() => console.log("I'm in")} 
                />
            </View>

        </Modal>
    )
}

const stylesReview = StyleSheet.create({
    taskNotes:{
        textAlignVertical: 'top',
        flexShrink: 1,
    },
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
        justifyContent: 'flex-start',
        flexGrow: 1,
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
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        flexShrink: 1,
        flexGrow: 1,
        margin: -3,
    },
    circle: {
        paddingHorizontal: 11,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        margin: 3,
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
    assignee: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emojiWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: (Platform.OS === 'android') ? 24 : 28,
        textAlign: 'center',
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
        flexWrap: 'wrap',
        gap: 10,
    },
    groupTitle: {
        width: 100,
        color: '#9F9F9F',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    },
});
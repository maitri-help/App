import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';

export default function TaskSelection({ selectedService, modalServiceTasks, onTaskSelect, setCurrentStep, currentStep, onBack, setIsOtherTask }) {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedServiceIcon, setSelectedServiceIcon] = useState(null);
    const [selectedServiceTitle, setSelectedServiceTitle] = useState('');
    const [pressedIndex, setPressedIndex] = useState(null);
    const [isOtherPressed, setIsOtherPressed] = useState(false);

    const handlePressIn = (index) => {
        setPressedIndex(index);
    };

    const handlePressOut = () => {
        setPressedIndex(null);
    };

    useEffect(() => {
        console.log("Selected service:", selectedService);
        if (selectedService && modalServiceTasks[selectedService.id]) {
            console.log("Setting tasks:", modalServiceTasks[selectedService.id]);
            setTasks(modalServiceTasks[selectedService.id]);
            setSelectedServiceIcon(selectedService.icon);
            setSelectedServiceTitle(selectedService.title);
        } else {
            console.log("No tasks found");
            setTasks([]);
            setSelectedServiceIcon(null);
            setSelectedServiceTitle('');
        }
    }, [selectedService, modalServiceTasks]);

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        onTaskSelect(task);
        setIsOtherTask(false);
        setCurrentStep(3);
    };

    const handleCustomTask = () => {
        setSelectedTask(null);
        onTaskSelect('');
        setIsOtherTask(true);
        setCurrentStep(3);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleOtherPressIn = () => {
        setIsOtherPressed(true);
    };

    const handleOtherPressOut = () => {
        setIsOtherPressed(false);
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesTasks.modalTopNav]}>
                <View style={stylesTasks.modalTopNavLeft}>
                    <TouchableOpacity onPress={handleBack} style={[styles.backLinkInline]}>
                        <ArrowLeftIcon style={styles.backLinkIcon} />
                    </TouchableOpacity>
                    <Image source={selectedService.icon} style={stylesTasks.icon} />
                    <Text style={[styles.topBarTitle, stylesTasks.topBarTitle]}>
                        {selectedService.title}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity onPress={handleCustomTask} style={[styles.skipLink]}>
                        <Text style={stylesTasks.skipText}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.contentContainer, stylesTasks.topDescription]}>
                <Text style={stylesTasks.topDescriptionText}>
                    Pick from list or create your own
                </Text>
            </View>
            <ScrollView>
                <View style={[styles.contentContainer, stylesTasks.tasksList]}>
                    {tasks.map((task, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={1}
                            style={[stylesTasks.tasksListItem, pressedIndex === index && stylesTasks.tasksListItemPressed]}
                            onPressIn={() => handlePressIn(index)}
                            onPressOut={handlePressOut}
                            onPress={() => handleTaskSelect(task)}
                        >
                            <Text style={[stylesTasks.tasksListItemText, pressedIndex === index && stylesTasks.tasksListItemTextPressed]}>
                                {task}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity activeOpacity={1}
                        style={[
                            stylesTasks.tasksListItem,
                            stylesTasks.tasksListItemOther,
                            isOtherPressed && stylesTasks.tasksListItemPressed
                        ]}
                        onPressIn={() => {
                            handleOtherPressIn();
                        }}
                        onPressOut={() => {
                            handleOtherPressOut();
                        }}
                        onPress={handleCustomTask}
                    >
                        <Text style={[
                            stylesTasks.tasksListItemText,
                            stylesTasks.tasksListItemTextOther,
                            isOtherPressed && stylesTasks.tasksListItemTextPressed
                        ]}>
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}

const stylesTasks = StyleSheet.create({
    modalTopNav: {
        justifyContent: 'space-between',
    },
    modalTopNavLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginLeft: 15,
        marginRight: 8,
    },
    topBarTitle: {
        fontSize: 16,
        fontFamily: 'poppins-medium'
    },
    skipText: {
        textDecorationLine: 'underline',
        fontSize: 16,
        fontFamily: 'poppins-medium'
    },
    topDescription: {
        marginTop: -15,
        marginBottom: 15,
    },
    topDescriptionText: {
        color: '#737373',
        fontSize: 13,
        lineHeight: 16,
        fontFamily: 'poppins-regular'
    },
    tasksListItem: {
        paddingVertical: 25,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    tasksListItemPressed: {
        backgroundColor: '#EFEFEF',
    },
    tasksListItemOther: {
        borderBottomWidth: 0,
    },
    tasksListItemText: {
        color: '#000',
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'poppins-regular'
    },
    tasksListItemTextOther: {
        fontFamily: 'poppins-semibold'
    },
});
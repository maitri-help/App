import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Animated,
    Platform,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import PlusModal from '../components/PlusModal';
import TaskModal from '../components/TaskModal';
import CustomWeekCalendar from '../components/calendar/CustomWeekCalendar';
import PlusIcon from '../assets/icons/plus-icon.svg';
import { stripCircles } from '../helpers/task.helpers';
import { formatDate } from '../helpers/date';
import MonthView from '../components/calendar/MonthView';
import Tab from '../components/common/Tab';
import Fab from '../components/common/Fab';
import { useLocation } from '../context/LocationContext';
import { useTask } from '../context/TaskContext';

export default function AssignmentsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Month');
    const [plusModalVisible, setPlusModalVisible] = useState(false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const { deviceLocation } = useLocation();

    const currentDate = new Date();

    const defaultSelectedDate = formatDate(currentDate, {
        formatString: 'yyyy-MM-dd'
    });
    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('');
    const [emoji, setEmoji] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const { tasks, isLoading } = useTask();

    const handleTaskItemClick = async (task) => {
        const newSelectedTask = stripCircles(task);
        setSelectedTask(newSelectedTask);
    };

    useEffect(() => {
        if (plusModalVisible || taskModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [plusModalVisible, taskModalVisible]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handlePlusModalClose = () => {
        setPlusModalVisible(false);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <View style={stylesCal.calendarContainer}>
                    <View style={[stylesCal.calendarWrapper]}>
                        <View style={stylesCal.tabs}>
                            <Tab
                                clickHandler={() => handleTabChange('Month')}
                                label={'Month'}
                                isActive={activeTab === 'Month'}
                            />
                            <Tab
                                clickHandler={() => handleTabChange('Week')}
                                label={'Week'}
                                isActive={activeTab === 'Week'}
                            />
                        </View>
                        {isLoading ? (
                            <View
                                style={{
                                    minHeight: 80,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <ActivityIndicator size="large" />
                            </View>
                        ) : (
                            <>
                                {activeTab === 'Month' ? (
                                    <MonthView
                                        tasks={tasks}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        setTaskModalVisible={
                                            setTaskModalVisible
                                        }
                                        handleTaskItemClick={
                                            handleTaskItemClick
                                        }
                                        activeTab={activeTab}
                                        isLoading={isLoading}
                                    />
                                ) : (
                                    <CustomWeekCalendar
                                        tasks={tasks}
                                        handleTaskItemClick={
                                            handleTaskItemClick
                                        }
                                        setTaskModalVisible={
                                            setTaskModalVisible
                                        }
                                    />
                                )}
                            </>
                        )}
                    </View>
                </View>
                <Fab
                    pressHandler={() => setPlusModalVisible(true)}
                    icon={<PlusIcon color={'#fff'} width={28} height={28} />}
                />
            </SafeAreaView>

            {(plusModalVisible || taskModalVisible) && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}

            <PlusModal
                visible={plusModalVisible}
                onClose={handlePlusModalClose}
                deviceLocation={deviceLocation}
            />

            <TaskModal
                visible={taskModalVisible}
                onClose={handleTaskModalClose}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                color={color}
                setColor={setColor}
                emoji={emoji}
                setEmoji={setEmoji}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
            />
        </>
    );
}

const stylesCal = StyleSheet.create({
    calendarContainer: {
        position: 'relative',
        zIndex: 2,
        flex: 1
    },
    whiteSpace: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        zIndex: 3,
        marginBottom: -1
    },
    calendarScroll: {
        position: 'relative',
        zIndex: 1
    },
    calendarWrapper: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 14,
        flex: 1
    },
    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E5E5',
        gap: 15,
        paddingTop: 20,
        paddingBottom: 18
    },
    todayWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 10
    },
    today: {
        color: '#737373',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 18,
        textDecorationLine: 'underline'
    }
});

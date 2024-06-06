import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Platform,
    Linking,
    AppState,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import PlusModal from '../components/PlusModal';
import TaskModal from '../components/TaskModal';
import CustomWeekCalendar from '../components/calendar/CustomWeekCalendar';
import PlusIcon from '../assets/icons/plus-icon.svg';
import { getTasksForUser } from '../hooks/api';
import { checkAuthentication } from '../authStorage';
import * as Location from 'expo-location';
import { stripCircles } from '../helpers/task.helpers';
import { formatDate } from '../helpers/date';
import MonthView from '../components/calendar/MonthView';
import LocationPermissionModal from '../components/Modals/LocationPermissionModal';
import Tab from '../components/common/Tab';

export default function AssignmentsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Month');
    const [plusModalVisible, setPlusModalVisible] = useState(false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const currentDate = new Date();

    const defaultSelectedDate = formatDate(currentDate, {
        formatString: 'yyyy-MM-dd'
    });
    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

    const [tasks, setTasks] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('');
    const [emoji, setEmoji] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleTaskItemClick = async (task) => {
        const newSelectedTask = stripCircles(task);
        setSelectedTask(newSelectedTask);
    };

    const handleTaskStatusChange = () => {
        fetchTasks();
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

    async function fetchTasks() {
        try {
            setIsLoading(true);
            const userData = await checkAuthentication();
            if (userData) {
                const tasksResponse = await getTasksForUser(
                    userData.userId,
                    userData.accessToken
                );

                setTasks(tasksResponse.data);
            } else {
                console.error('No user data found');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const [locationPermissionNeeded, setLocationPermissionNeeded] =
        useState(false);

    const requestLocation = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted && !permission.canAskAgain) {
            setLocationPermissionNeeded(true);

            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setDeviceLocation(
            `${location.coords.latitude},${location.coords.longitude}`
        );
    };

    useEffect(() => {
        requestLocation();
    }, []);

    const handleGoToSettings = () => {
        Linking.openSettings();
        setLocationPermissionNeeded(false);
    };

    const appState = useRef(AppState.currentState);
    const [deviceLocation, setDeviceLocation] = useState(null);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    requestLocation();
                }
                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

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
                                        handleTaskStatusChange={
                                            handleTaskStatusChange
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
                                        handleTaskStatusChange={
                                            handleTaskStatusChange
                                        }
                                    />
                                )}
                            </>
                        )}
                    </View>
                </View>

                <View style={stylesCal.floatingButtonWrapper}>
                    <TouchableOpacity
                        onPress={() => setPlusModalVisible(true)}
                        style={styles.floatingButton}
                        activeOpacity={1}
                    >
                        <PlusIcon color={'#fff'} width={28} height={28} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {(plusModalVisible || taskModalVisible) && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}

            <PlusModal
                visible={plusModalVisible}
                onClose={handlePlusModalClose}
                onTaskCreated={() => fetchTasks()}
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
                onTaskCreated={() => fetchTasks()}
            />

            {locationPermissionNeeded && (
                <LocationPermissionModal
                    locationPermissionNeeded={locationPermissionNeeded}
                    handleGoToSettings={handleGoToSettings}
                />
            )}
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
    },
    floatingButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 5
    }
});

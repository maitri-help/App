import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated, Platform, Image, FlatList, Modal, Linking, AppState } from 'react-native';
import styles from '../Styles';
import TaskItem from '../components/TaskItem';
import PlusModal from '../components/PlusModal';
import TaskModal from '../components/TaskModal';
import GridCalendar from '../components/calendar/GridCalendar';
import WeekCalendar from '../components/calendar/WeekCalendar';
import PlusIcon from '../assets/icons/plus-icon.svg';
import { getTasksForUser } from '../hooks/api';
import { checkAuthentication } from '../authStorage';
import * as Location from 'expo-location';

export default function AssignmentsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Month');
    const [plusModalVisible, setPlusModalVisible] = useState(false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const currentDate = new Date();
    const formattedDay = String(currentDate.getDate()).padStart(2, '0');
    const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedYear = currentDate.getFullYear();

    const defaultSelectedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;
    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [defaultWeekDate, setDefaultWeekDate] = useState(new Date());
    const [weekStartDate, setWeekStartDate] = useState(new Date());
    const [weekSelectedDate, setWeekSelectedDate] = useState(selectedDate);

    const [tasks, setTasks] = useState([]);
    const [userId, setUserId] = useState(null);

    const [taskModalSelectedCircle, setTaskModalSelectedCircle] = useState('Personal');
    const [taskModalTaskName, setTaskModalTaskName] = useState('');
    const [taskModalTaskId, setTaskModalTaskId] = useState('');
    const [taskModaldescription, setTaskModalDescription] = useState('');
    const [taskModalSelectedLocation, setTaskModalSelectedLocation] = useState('');
    const [taskModalStartDate, setTaskModalStartDate] = useState(null);
    const [taskModalEndDate, setTaskModalEndDate] = useState(null);
    const [taskModalStartTime, setTaskModalStartTime] = useState(null);
    const [taskModalEndTime, setTaskModalEndTime] = useState(null);
    const [plusModalStartDate, setPlusModalStartDate] = useState(null);
    const [plusModalEndDate, setPlusModalEndDate] = useState(null);
    const [plusModalStartTime, setPlusModalStartTime] = useState(null);
    const [plusModalEndTime, setPlusModalEndTime] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('');
    const [emoji, setEmoji] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const flatListRef = useRef();
    const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(true);

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleDateTimeSelectPlus = ({ startDateTime, endDateTime }) => {
        setPlusModalStartDate(startDateTime);
        setPlusModalEndDate(endDateTime);
    };

    const handleDateTimeSelectTask = ({ startDateTime, endDateTime }) => {
        setTaskModalStartDate(startDateTime);
        setTaskModalEndDate(endDateTime);
    };

    const handleDayPressPlus = (day) => {
        if (plusModalStartDate && plusModalEndDate) {
            setPlusModalStartDate(day.dateString);
            setPlusModalEndDate(null);
        } else if (plusModalStartDate && !plusModalEndDate) {
            const startDate = new Date(plusModalStartDate);
            const endDate = new Date(day.dateString);

            if (startDate <= endDate) {
                setPlusModalEndDate(day.dateString);
            } else {
                setPlusModalStartDate(day.dateString);
                setPlusModalEndDate(null);
            }
        } else {
            setPlusModalStartDate(day.dateString);
        }
    };

    const handleDayPressTask = (day) => {
        if (taskModalStartDate && taskModalEndDate) {
            setTaskModalStartDate(day.dateString);
            setTaskModalEndDate(null);
        } else if (taskModalStartDate && !taskModalEndDate) {
            const startDate = new Date(taskModalStartDate);
            const endDate = new Date(day.dateString);

            if (startDate <= endDate) {
                setTaskModalEndDate(day.dateString);
            } else {
                setTaskModalStartDate(day.dateString);
                setTaskModalEndDate(null);
            }
        } else {
            setTaskModalStartDate(day.dateString);
        }
    };

    const getDaysBetween = (start, end) => {
        let currentDate = new Date(start);
        const endDate = new Date(end);
        let markedDates = {};
        currentDate.setDate(currentDate.getDate() + 1);
        while (currentDate < endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            markedDates[dateString] = { color: '#1C4837', textColor: '#fff' };
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return markedDates;
    };

    useEffect(() => {
        if (plusModalVisible || taskModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [plusModalVisible, taskModalVisible]);

    const handleTodayPress = () => {
        const today = new Date();
        const formattedDay = String(today.getDate()).padStart(2, '0');
        const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
        const formattedYear = today.getFullYear();
        const todayFormatted = `${formattedYear}-${formattedMonth}-${formattedDay}`;

        setSelectedDate(todayFormatted);
        setCurrentMonth(today.getMonth() + 1);
        setCurrentYear(today.getFullYear());
        setDefaultWeekDate(today);
    };

    const handleDateSelection = (date) => {
        const formattedDate = new Date(date);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const day = String(formattedDate.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
        setWeekSelectedDate(`${year}-${month}-${day}`);
        scrollToClosestDate(date);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'Week') {
            setWeekSelectedDate(selectedDate);
            setDefaultWeekDate(new Date(selectedDate));
        }
    };

    const handlePlusModalClose = () => {
        setPlusModalVisible(false);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
    };

    const scrollToClosestDate = (date) => {
        const selected = new Date(date);
        const closestIndex = tasks?.reduce((closestIndex, task, index) => {
            const taskStartDate = new Date(task.startDateTime);
            const closest = new Date(tasks[closestIndex].startDateTime);
            return Math.abs(selected - taskStartDate) < Math.abs(selected - closest) ? index : closestIndex;
        }, 0);

        setIsProgrammaticScroll(true);
        flatListRef.current?.scrollToIndex({ index: closestIndex, animated: true });
    };

    const handleViewableItemsChanged = (viewableItem) => {
        if (isProgrammaticScroll) return;

        const formattedDate = new Date(viewableItem.item.startDateTime);
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const day = String(formattedDate.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
        setWeekSelectedDate(`${year}-${month}-${day}`);
        setDefaultWeekDate(formattedDate);
        setCurrentMonth(formattedDate.getMonth() + 1);
        setCurrentYear(formattedDate.getFullYear());
    };

    async function fetchTasks() {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                console.log('User Data:', userData);
                console.log('Access token:', userData.accessToken);

                const tasksResponse = await getTasksForUser(userData.userId, userData.accessToken);
                setUserId(userData.userId);
                setTasks(tasksResponse.data);
            } else {
                console.error('No user data found');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            scrollToClosestDate(selectedDate);
        }
    }, [tasks]);

    /* const filteredTasks = tasks.filter(task => {
        const taskStartDate = new Date(task.startDateTime);
        const taskEndDate = new Date(task.endDateTime);

        return (
            selectedDate >= taskStartDate.toISOString().split('T')[0] &&
            selectedDate <= taskEndDate.toISOString().split('T')[0]
        );
    }); */

    const [locationPermissionNeeded, setLocationPermissionNeeded] = useState(false);

    const requestLocation = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();
        console.log('LOCATION PERMISSION', permission);
        if (!permission.granted && !permission.canAskAgain) {
            setLocationPermissionNeeded(true);
            console.log('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setDeviceLocation(`${location.coords.latitude},${location.coords.longitude}`);
        console.log('LOCATION', location);
    };


    useEffect(() => {
        requestLocation();
    }, []);

    const handleGoToSettings = () => {
        Linking.openSettings();
        setLocationPermissionNeeded(false);
    }

    const appState = useRef(AppState.currentState);
    const [deviceLocation, setDeviceLocation] = useState(null);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
                requestLocation();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <>
            <SafeAreaView style={styles.safeArea}>

                <View style={stylesCal.calendarContainer}>
                    <View style={stylesCal.whiteSpace}></View>
                    <View style={[styles.contentContainer, stylesCal.calendarWrapper]}>
                        <View style={stylesCal.tabs}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => setActiveTab('Month')} style={[stylesCal.tab, activeTab === 'Month' ? stylesCal.tabActive : '']}>
                                <Text style={[stylesCal.tabText, activeTab === 'Month' ? stylesCal.tabActiveText : '']}>Month</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => handleTabChange('Week')} style={[stylesCal.tab, activeTab === 'Week' ? stylesCal.tabActive : '']}>
                                <Text style={[stylesCal.tabText, activeTab === 'Week' ? stylesCal.tabActiveText : '']}>Week</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleTodayPress}
                            style={stylesCal.todayWrapper}>
                            <Text style={stylesCal.today}>Today</Text>
                        </TouchableOpacity>

                        {activeTab === 'Month' ? (
                            <GridCalendar
                                setDate={handleDateSelection}
                                selectedDate={selectedDate}
                                currentYearProp={currentYear}
                                currentMonthProp={currentMonth}
                                setCurrentYear={setCurrentYear}
                                setCurrentMonth={setCurrentMonth}
                                setWeekStartDate={setWeekStartDate}
                                tasks={tasks}
                            />
                        ) : (
                            <WeekCalendar
                                setDate={handleDateSelection}
                                selectedDate={selectedDate}
                                defaultDate={defaultWeekDate}
                                setWeekStartDate={setWeekStartDate}
                                weekSelectedDate={weekSelectedDate}
                                setWeekSelectedDate={setWeekSelectedDate}
                                tasks={tasks}
                            />
                        )}
                    </View>
                </View>


                {tasks.length === 0 ? (
                    tasks.length === 0 && (
                        <>
                            <View style={stylesCal.calendarEmpty}>
                                <View style={stylesCal.calendarEmptyImgWrapper}>
                                    <Image source={require('../assets/img/tasks-placeholder.png')} style={stylesCal.calendarEmptyImg} />
                                </View>
                                <Text style={stylesCal.calendarEmptyText}>
                                    Your list is empty
                                </Text>
                                <Text style={stylesCal.calendarEmptyTitle}>
                                    Click here to add your first task
                                </Text>
                                <Image source={require('../assets/img/purple-arrow-right.png')} style={stylesCal.calendarEmptyArrow} />
                            </View>
                        </>
                    )/*  : (
                        <>
                            <View style={stylesCal.calendarEmpty}>
                                <Text style={stylesCal.calendarEmptyText}>
                                    No tasks for this day
                                </Text>
                                <Text style={stylesCal.calendarEmptyTitle}>
                                    Click here to add a new task
                                </Text>
                                <Image source={require('../assets/img/purple-arrow-right.png')} style={stylesCal.calendarEmptyArrow} />
                            </View>
                        </>
                    ) */
                ) : (
                    /* <ScrollView contentContainerStyle={stylesCal.calendarScroll}>
                        <View style={[styles.contentContainer, stylesCal.tasksWrapper]}>
                            {filteredTasks.map((task, index) => (
                                <TaskItem
                                    key={index}
                                    task={task}
                                    taskModal={() => setTaskModalVisible(true)}
                                    onTaskItemClick={handleTaskItemClick}
                                />
                            ))}
                        </View>
                    </ScrollView> */
                    <FlatList 
                        contentContainerStyle={[styles.contentContainer, stylesCal.tasksWrapper]}
                        data={tasks}
                        keyExtractor={(item) => item.taskId}
                        ref={flatListRef}
                        renderItem={({ item }) => (
                            <TaskItem
                                key={item.taskId}
                                task={item}
                                taskModal={() => setTaskModalVisible(true)}
                                onTaskItemClick={handleTaskItemClick}
                            />
                        )}
                        onViewableItemsChanged={({ viewableItems }) => {
                            if (viewableItems.length > 0) handleViewableItemsChanged(viewableItems[0]);
                        }}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 50,
                        }}
                        onScrollBeginDrag={() => setIsProgrammaticScroll(false)}
                        onScrollToIndexFailed={info => {
                            const wait = new Promise(resolve => setTimeout(resolve, 100));
                            wait.then(() => {
                              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                            });
                          }}
                    />
                )}

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
                <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
            )}

            <PlusModal
                visible={plusModalVisible}
                onClose={handlePlusModalClose}
                startDate={plusModalStartDate}
                setStartDate={setPlusModalStartDate}
                endDate={plusModalEndDate}
                setEndDate={setPlusModalEndDate}
                startTime={plusModalStartTime}
                setStartTime={setPlusModalStartTime}
                endTime={plusModalEndTime}
                setEndTime={setPlusModalEndTime}
                handleDayPress={handleDayPressPlus}
                getDaysBetween={getDaysBetween}
                handleDateTimeSelect={handleDateTimeSelectPlus}
                onTaskCreated={() => fetchTasks()}
                deviceLocation={deviceLocation}
            />

            <TaskModal
                visible={taskModalVisible}
                onClose={handleTaskModalClose}
                selectedCircle={taskModalSelectedCircle}
                setSelectedCircle={setTaskModalSelectedCircle}
                taskId={taskModalTaskId}
                setTaskId={setTaskModalTaskId}
                taskName={taskModalTaskName}
                setTaskName={setTaskModalTaskName}
                description={taskModaldescription}
                setDescription={setTaskModalDescription}
                selectedLocation={taskModalSelectedLocation}
                setSelectedLocation={setTaskModalSelectedLocation}
                startDate={taskModalStartDate}
                setStartDate={setTaskModalStartDate}
                endDate={taskModalEndDate}
                setEndDate={setTaskModalEndDate}
                startTime={taskModalStartTime}
                setStartTime={setTaskModalStartTime}
                endTime={taskModalEndTime}
                setEndTime={setTaskModalEndTime}
                handleDayPress={handleDayPressTask}
                getDaysBetween={getDaysBetween}
                handleDateTimeSelect={handleDateTimeSelectTask}
                selectedTask={selectedTask}
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
                <Modal visible={locationPermissionNeeded} onRequestClose={() => console.log("close")} animationType='fade' transparent>
                    <TouchableOpacity onPress={() => console.log("close")} style={stylesCal.innerModalContainer}>
                        <View style={stylesCal.innerModalContent}>
                        <View style={stylesCal.innerModalTexts}>
                            <Text style={stylesCal.innerModalTitle}>Please provide access for this app to the device's location.</Text>
                            <Text style={stylesCal.innerModalSubtitle}>We need your location to position the map the closest to you as possible.</Text>
                        </View>
                        <View style={stylesCal.innerModalButtons}>
                            <TouchableOpacity style={[stylesCal.innerModalButton, stylesCal.innerModalButtonRed]} onPress={handleGoToSettings}>
                            <Text style={[stylesCal.innerModalButtonText, stylesCal.innerModalButtonRedText]}>Go to Settings</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </>
    );
}

const stylesCal = StyleSheet.create({
    calendarContainer: {
        position: 'relative',
        zIndex: 2,
    },
    whiteSpace: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        zIndex: 3,
        marginBottom: -1,
    },
    calendarScroll: {
        position: 'relative',
        zIndex: 1,
    },
    calendarWrapper: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 14,
    },
    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E5E5',
        gap: 15,
        paddingTop: 20,
        paddingBottom: 18,
    },
    tab: {
        borderWidth: 1,
        borderColor: '#1C4837',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    tabActive: {
        backgroundColor: '#1C4837',
    },
    tabText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 18,
    },
    tabActiveText: {
        color: '#fff'
    },
    todayWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 10,
    },
    today: {
        color: '#737373',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 18,
        textDecorationLine: 'underline',
    },
    tasksWrapper: {
        paddingTop: 20,
        paddingBottom: 30,
        gap: 15,
    },
    floatingButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 5,
    },
    calendarEmpty: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'relative',
        paddingBottom: 35,
    },
    calendarEmptyImgWrapper: {
        marginVertical: 20,
    },
    calendarEmptyImg: {
        width: 180,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    calendarEmptyText: {
        textAlign: 'center',
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 5,
    },
    calendarEmptyTitle: {
        textAlign: 'center',
        color: '#000',
        fontFamily: 'poppins-medium',
        fontSize: 14,
        lineHeight: 18,
    },
    calendarEmptyArrow: {
        position: 'absolute',
        bottom: 11,
        right: 71,
        width: 60,
        height: 15,
        resizeMode: 'contain'
    },
    innerModalContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      innerModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        maxWidth: 350,
        paddingHorizontal: 20,
        paddingVertical: 30,
      },
      innerModalTexts: {
        marginBottom: 20,
      },
      innerModalTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 5
      },
      innerModalSubtitle: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center',
      },
      innerModalButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
      },
      innerModalButton: {
        alignItems: 'center',
        minWidth: 125,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
      },
      innerModalButtonRed: {
        backgroundColor: '#FF7070',
      },
      innerModalButtonWhite: {
        backgroundColor: '#fff',
      },
      innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18,
      },
      innerModalButtonRedText: {
        color: '#fff',
      },
      innerModalButtonWhiteText: {
        color: '#000',
      },
});
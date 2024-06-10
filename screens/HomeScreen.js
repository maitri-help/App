import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import BellIcon from '../assets/icons/bell-icon.svg';
import TaskItem from '../components/TaskItem';
import { getNotificationsForUser, getThankYouCardsForUser } from '../hooks/api';
import {
    checkAuthentication,
    clearUserData,
    clearAccessToken
} from '../authStorage';
import TaskModal from '../components/TaskModal';
import { useFocusEffect } from '@react-navigation/native';
import LeadBoxes from '../components/Lead/LeadBoxes';
import { stripCircles } from '../helpers/task.helpers';
import { StatusBar } from 'expo-status-bar';
import PlusModal from '../components/PlusModal';
import LocationPermissionModal from '../components/Modals/LocationPermissionModal';
import { useLocation } from '../context/LocationContext';
import { useTask } from '../context/TaskContext';
import Tab from '../components/common/Tab';

export default function HomeScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('All');
    const [firstName, setFirstName] = useState('');
    const [greetingText, setGreetingText] = useState('');

    const { tasks, isLoading } = useTask();
    const [plusModalVisible, setPlusModalVisible] = useState(false);

    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const [assigneeFirstName, setAssigneeFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('');
    const [emoji, setEmoji] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [hasUnreadPendingRequest, setHasUnreadPendingRequest] =
        useState(false);

    const [thankYouCards, setThankYouCards] = useState([]);

    const { locationPermissionNeeded } = useLocation();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    setFirstName(userData.firstName);

                    const currentHour = new Date().getHours();
                    if (currentHour < 12) {
                        setGreetingText('Good morning');
                    } else if (currentHour < 18) {
                        setGreetingText('Good afternoon');
                    } else {
                        setGreetingText('Good evening');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
        }
        fetchUserData();
    }, []);

    async function fetchNotifications() {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                const notificationsResponse = await getNotificationsForUser(
                    userData.userId,
                    userData.accessToken
                );
                const notificationsData = notificationsResponse.data;
                setNotifications(notificationsData);

                const hasUnreadPending = notificationsData.some(
                    (notification) =>
                        notification.isRead === false ||
                        (notification.type === 'pending_request' &&
                            notification.isRead === false)
                );
                setHasUnreadPendingRequest(hasUnreadPending);
            } else {
                console.error('No user data found');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    async function fetchThankYouCards() {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                const thankYouCardsResponse = await getThankYouCardsForUser(
                    userData.userId,
                    userData.accessToken
                );
                if (
                    thankYouCardsResponse.data &&
                    thankYouCardsResponse.data.length > 0
                ) {
                    setThankYouCards(thankYouCardsResponse.data);
                }
            } else {
                console.error('No user data found');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
        } catch (error) {
            console.error(
                'Error fetching thank you cards:',
                error.response.data
            );
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            //fetchTasks();
            fetchNotifications();
            fetchThankYouCards();
        }, [])
    );

    useEffect(() => {
        if (taskModalVisible || plusModalVisible) {
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
    }, [taskModalVisible, plusModalVisible]);

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const handleTaskItemClick = async (task) => {
        const newSelectedTask = stripCircles(task);
        setSelectedTask(newSelectedTask);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
    };

    const renderTasks = (tasks) => {
        if (tasks?.length === 0) {
            switch (activeTab) {
                case 'All':
                    return (
                        <View style={stylesHome.tasksContainer}>
                            <ScrollView
                                contentContainerStyle={
                                    stylesHome.tasksScrollEmpty
                                }
                            >
                                <View
                                    style={[
                                        styles.contentContainer,
                                        stylesHome.tasksEmpty
                                    ]}
                                >
                                    <View style={stylesHome.tasksTop}>
                                        <Text style={stylesHome.tasksWelcome}>
                                            Welcome to Maitri!
                                        </Text>
                                        <View
                                            style={stylesHome.tasksImgWrapper}
                                        >
                                            <Image
                                                source={require('../assets/img/tasks-placeholder.png')}
                                                style={stylesHome.tasksImg}
                                            />
                                        </View>
                                    </View>
                                    <View style={stylesHome.tasksBottom}>
                                        <Text
                                            style={stylesHome.tasksDescription}
                                        >
                                            Click here To add your first task
                                        </Text>
                                        <View
                                            style={
                                                stylesHome.tasksArrowImgWrapper
                                            }
                                        >
                                            <Image
                                                source={require('../assets/img/purple-arrow-down.png')}
                                                style={stylesHome.tasksArrowImg}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                case 'Unassigned':
                    return (
                        <View style={stylesHome.tasksContainer}>
                            <ScrollView
                                contentContainerStyle={
                                    stylesHome.tasksScrollEmpty
                                }
                            >
                                <View
                                    style={[
                                        styles.contentContainer,
                                        stylesHome.tasksEmpty
                                    ]}
                                >
                                    <View
                                        style={stylesHome.unassignedContainer}
                                    >
                                        <View style={stylesHome.textWrapper}>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    stylesHome.text
                                                ]}
                                            >
                                                All tasks have been assigned
                                            </Text>
                                        </View>
                                        <View
                                            style={
                                                stylesHome.illustrationWrapper
                                            }
                                        >
                                            <Image
                                                source={require('../assets/img/mimi-illustration.png')}
                                                style={stylesHome.illustration}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                case 'Personal':
                    return (
                        <View style={stylesHome.tasksContainer}>
                            <ScrollView
                                contentContainerStyle={
                                    stylesHome.tasksScrollEmpty
                                }
                            >
                                <View
                                    style={[
                                        styles.contentContainer,
                                        stylesHome.tasksEmpty
                                    ]}
                                >
                                    <View style={stylesHome.tasksPersonalTop}>
                                        <Text
                                            style={[
                                                styles.text,
                                                stylesHome.text
                                            ]}
                                        >
                                            You have no personal tasks yet
                                        </Text>
                                    </View>
                                    <View style={stylesHome.tasksBottom}>
                                        <Text
                                            style={stylesHome.tasksDescription}
                                        >
                                            Click here To add your first task
                                        </Text>
                                        <View
                                            style={
                                                stylesHome.tasksArrowImgWrapper
                                            }
                                        >
                                            <Image
                                                source={require('../assets/img/purple-arrow-down.png')}
                                                style={stylesHome.tasksArrowImg}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                default:
                    return null;
            }
        }

        let filteredTasks = tasks?.sort((taskA, taskB) => {
            return (
                new Date(taskA.startTime).getTime() -
                new Date(taskB.startTime).getTime()
            );
        });
        switch (activeTab) {
            case 'Unassigned':
                filteredTasks = tasks?.filter(
                    (task) =>
                        !task?.assignee &&
                        !task?.circles.some(
                            (circle) => circle.circleLevel === 'Personal'
                        )
                );
                break;
            case 'Personal':
                filteredTasks = tasks?.filter((task) =>
                    task?.circles.some(
                        (circle) => circle.circleLevel === 'Personal'
                    )
                );
                break;
            default:
                break;
        }

        filteredTasks = filteredTasks.sort((a, b) => {
            if (a.status === 'done' && b.status !== 'done') {
                return 1;
            } else if (a.status !== 'done' && b.status === 'done') {
                return -1;
            } else {
                return (
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
                );
            }
        });

        return (
            <View style={stylesHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesHome.tasksScroll}>
                    {filteredTasks?.map((task) => (
                        <TaskItem
                            key={task?.taskId}
                            task={task}
                            taskModal={() => setTaskModalVisible(true)}
                            onTaskItemClick={handleTaskItemClick}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <>
            <StatusBar style="dark" translucent={true} hidden={false} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topBar}>
                    <Text style={stylesHome.greetingsText}>
                        {greetingText} {firstName}!
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                        style={stylesHome.bellWrapper}
                    >
                        <BellIcon style={stylesHome.bellIcon} />
                        {hasUnreadPendingRequest && (
                            <View style={stylesHome.indicator}></View>
                        )}
                    </TouchableOpacity>
                </View>
                <LeadBoxes
                    navigation={navigation}
                    thankYouCards={thankYouCards}
                    setThankYouCards={setThankYouCards}
                    onAddNewTask={() => setPlusModalVisible(true)}
                />
                <View
                    style={[stylesHome.tabsContainer, styles.contentContainer]}
                >
                    <Tab
                        clickHandler={() => handleTabPress('All')}
                        label={'All tasks'}
                        isActive={activeTab === 'All'}
                    />
                    <Tab
                        clickHandler={() => handleTabPress('Unassigned')}
                        label={'Unassigned'}
                        isActive={activeTab === 'Unassigned'}
                    />
                    <Tab
                        clickHandler={() => handleTabPress('Personal')}
                        label={'Personal'}
                        isActive={activeTab === 'Personal'}
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
                    <View style={stylesHome.tabsContentContainer}>
                        {renderTasks(tasks)}
                    </View>
                )}
            </SafeAreaView>
            {(taskModalVisible || plusModalVisible) && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}
            <PlusModal
                visible={plusModalVisible}
                onClose={() => setPlusModalVisible(false)}
                onTaskCreated={() => fetchTasks()}
            />

            {locationPermissionNeeded && <LocationPermissionModal />}

            <TaskModal
                visible={taskModalVisible}
                onClose={handleTaskModalClose}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                firstName={assigneeFirstName}
                setFirstName={setAssigneeFirstName}
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
        </>
    );
}

const stylesHome = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium'
    },
    bellWrapper: {
        position: 'relative',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -5,
        marginVertical: -5
    },
    bellIcon: {
        width: 20,
        height: 20,
        color: '#000'
    },
    indicator: {
        backgroundColor: '#E91145',
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        bottom: 4,
        right: 1
    },

    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginVertical: 10
    },
    tabsContentContainer: {
        flex: 1
    },
    tasksContainer: {
        flex: 1
    },
    tasksScroll: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 10,
        paddingBottom: 30
    },
    tasksScrollEmpty: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 25
    },
    tasksEmpty: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    tasks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    tasksWelcome: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'poppins-bold',
        marginBottom: 15
    },
    tasksImgWrapper: {
        alignItems: 'center',
        marginBottom: 15
    },
    tasksImg: {
        width: 150,
        height: 110,
        resizeMode: 'contain'
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'poppins-medium',
        lineHeight: 20,
        marginBottom: 10
    },
    tasksArrowImgWrapper: {
        alignItems: 'center',
        marginBottom: 20
    },
    tasksArrowImg: {
        width: 35,
        height: 90,
        resizeMode: 'contain',
        marginLeft: -120
    },
    unassignedContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 25
    },
    illustrationWrapper: {
        alignItems: 'center'
    },
    illustration: {
        width: 120,
        height: 120,
        resizeMode: 'contain'
    },
    text: {
        textAlign: 'center'
    },
    tasksPersonalTop: {
        justifyContent: 'center',
        flex: 1
    }
});

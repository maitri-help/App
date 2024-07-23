import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    Animated,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import OpenTask from '../components/OpenTask';
import MyTask from '../components/MyTask';
import { fetchTasks, getLeadUser, getNotificationsForUser } from '../hooks/api';
import { checkAuthentication, getAccessToken } from '../authStorage';
import TaskDetailsModal from '../components/plusModalSteps/TaskDetailsModal';
import MyTaskDetailsModal from '../components/plusModalSteps/MyTaskDetailsModal';
import initalBackground from '../assets/img/welcome-bg.png';
import { Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { inspirationalQuotes } from '../constants/quotes';
import { generateRandomQuote } from '../helpers';
import ThankYouModal from '../components/supporter/ThankYouModal';
import { StatusBar } from 'expo-status-bar';
import Tab from '../components/common/Tab';
import { useTask } from '../context/TaskContext';
import { useUser } from '../context/UserContext';
import { RefreshControl } from 'react-native-gesture-handler';

export default function HomeSupporterScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Open');

    const [leadUser, setLeadUser] = useState({});
    const [isViewActive, setIsViewActive] = useState(true);
    const [showAllOpenTasks, setShowAllOpenTasks] = useState(false);
    const [showAllMyTasks, setShowAllMyTasks] = useState(false);

    const [randomInspirationalQuote, setRandomInspirationalQuote] =
        useState('');

    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [myTaskModalVisible, setMyTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const { tasks, isLoading, setTasks } = useTask();
    const { userData } = useUser();

    useEffect(() => {
        setRandomInspirationalQuote(generateRandomQuote(inspirationalQuotes));
    }, [tasks?.length]);

    useEffect(() => {
        const fetchLeadUserData = async () => {
            try {
                const accessToken = await getAccessToken();

                const userData = await getLeadUser(accessToken);

                setLeadUser(userData.data[0]);
            } catch (error) {
                console.error('Error fetching lead user data:', error);
            }
        };

        fetchLeadUserData();
    }, []);

    const leadUserName = `${leadUser?.firstName || 'Lead'} ${
        leadUser?.lastName || 'Name'
    }`;

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        if (taskModalVisible || myTaskModalVisible) {
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
    }, [taskModalVisible, myTaskModalVisible]);

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
        setMyTaskModalVisible(false);
    };

    const [thankYouNotifications, setThankYouNotifications] = useState([]);
    const [thankYouModalVisible, setThankYouModalVisible] = useState(false);

    async function fetchNotifications() {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                const notificationsResponse = await getNotificationsForUser(
                    userData?.userId,
                    userData?.accessToken
                );
                const notificationsData = notificationsResponse.data;
                if (notificationsData.length > 0) {
                    const notificationsToShow = notificationsData.filter(
                        (n) => n.type === 'thankyou' && !n.isRead
                    );
                    if (notificationsToShow.length > 0) {
                        setThankYouNotifications(notificationsToShow);
                        setThankYouModalVisible(true);
                    }
                }
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    useEffect(() => {
        if (thankYouModalVisible) {
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
    }, [thankYouModalVisible]);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchTasks(userData)
            .then((resTasks) => {
                setTimeout(() => {
                    setTasks(resTasks);
                    setRefreshing(false);
                }, 600);
            })
            .catch((err) => {
                console.error(err);
                setRefreshing(false);
            });
    }, []);

    const renderTasks = (tasks = []) => {
        let filteredTasks = tasks;

        if (activeTab === 'Open') {
            filteredTasks = tasks.filter(
                (task) => task.status === 'undone' && !task.assignedUserId
            );
        } else if (activeTab === 'My') {
            filteredTasks = tasks.filter(
                (task) =>
                    task.assignedUserId &&
                    task.assignedUserId === userData?.userId
            );
        }

        if (filteredTasks?.length === 0) {
            return (
                <View style={stylesSuppHome.tasksContainer}>
                    <ScrollView
                        contentContainerStyle={stylesSuppHome.tasksScrollEmpty}
                    >
                        <View
                            style={[
                                styles.contentContainer,
                                stylesSuppHome.tasksEmpty
                            ]}
                        >
                            <View style={stylesSuppHome.tasksTop}>
                                <Text style={stylesSuppHome.tasksWelcome}>
                                    {activeTab === 'Open'
                                        ? 'No open tasks yet.'
                                        : 'Your task list is currently empty.'}
                                </Text>
                                <View style={stylesSuppHome.tasksImgWrapper}>
                                    <Image
                                        source={require('../assets/img/tasks-placeholder.png')}
                                        style={stylesSuppHome.tasksImg}
                                    />
                                </View>
                            </View>
                            <View style={stylesSuppHome.tasksBottom}>
                                <Text style={stylesSuppHome.tasksDescription}>
                                    {activeTab === 'Open'
                                        ? 'Check back in later!'
                                        : 'Check the Open tasks to see where you can lend a hand.'}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        const displayedTasks = filteredTasks.slice(
            0,
            showAllOpenTasks || showAllMyTasks ? filteredTasks?.length : 3
        );

        return (
            <View style={stylesSuppHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesSuppHome.tasksScroll}>
                    {displayedTasks.map((task) =>
                        activeTab === 'Open' ? (
                            <OpenTask
                                key={task.taskId}
                                task={task}
                                taskModal={() => setTaskModalVisible(true)}
                                onTaskItemClick={handleTaskItemClick}
                            />
                        ) : (
                            <MyTask
                                key={task.taskId}
                                task={task}
                                taskModal={() => setMyTaskModalVisible(true)}
                                onTaskItemClick={handleTaskItemClick}
                                isCheckbox={true}
                            />
                        )
                    )}
                    {(filteredTasks?.length > 3 &&
                        !showAllOpenTasks &&
                        activeTab === 'Open') ||
                    (filteredTasks?.length > 3 &&
                        !showAllMyTasks &&
                        activeTab === 'My') ? (
                        <TouchableOpacity
                            onPress={() =>
                                activeTab === 'Open'
                                    ? setShowAllOpenTasks(true)
                                    : setShowAllMyTasks(true)
                            }
                        >
                            <Text style={stylesSuppHome.seeAllText}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </ScrollView>
            </View>
        );
    };

    return (
        <>
            <StatusBar style="dark" translucent={true} hidden={false} />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={stylesSuppHome.topBar}>
                        <View
                            style={[
                                stylesSuppHome.selectedEmojiItem,
                                { borderColor: userData?.color }
                            ]}
                        >
                            <Text style={stylesSuppHome.selectedEmojiText}>
                                {userData?.emoji}
                            </Text>
                        </View>
                        <View style={{ flexShrink: 1 }}>
                            <Text style={stylesSuppHome.greetingsText}>
                                Hey {userData?.firstName}
                            </Text>
                            <Text style={stylesSuppHome.thanksText}>
                                Thanks for being here for{' '}
                                <Text style={stylesSuppHome.nameText}>
                                    {leadUserName}!
                                </Text>
                            </Text>
                        </View>
                    </View>

                    {isViewActive && (
                        <View
                            style={[
                                styles.contentContainer,
                                { paddingTop: 5, paddingBottom: 15, width: '100%' }
                            ]}
                        >
                            <ImageBackground
                                source={initalBackground}
                                style={stylesSuppHome.roundedRectangleContainer}
                            >
                                <View
                                    style={{
                                        alignItems: 'left',
                                        flexDirection: 'column',
                                        flex: 1,
                                        paddingRight: 10
                                    }}
                                >
                                    {tasks?.length > 0 ? (
                                        <Text
                                            style={
                                                stylesSuppHome.inspirationalQuoteText
                                            }
                                        >
                                            {randomInspirationalQuote}
                                        </Text>
                                    ) : (
                                        <>
                                            <Text
                                                style={stylesSuppHome.welcomeText}
                                            >
                                                Welcome to your home page
                                            </Text>
                                            <Text style={stylesSuppHome.infoText}>
                                                Tasks will show up below
                                            </Text>
                                        </>
                                    )}
                                </View>
                                <Image
                                    source={require('../assets/img/mimi-flower-illustration.png')}
                                    style={stylesSuppHome.rightImageStyle}
                                />
                            </ImageBackground>
                        </View>
                    )}

                    <View
                        style={[
                            stylesSuppHome.tabsContainer,
                            styles.contentContainer
                        ]}
                    >
                        <Tab
                            clickHandler={() => handleTabPress('Open')}
                            label={'Open tasks'}
                            isActive={activeTab === 'Open'}
                        />
                        <Tab
                            clickHandler={() => handleTabPress('My')}
                            label={'My tasks'}
                            isActive={activeTab === 'My'}
                        />
                    </View>
                    {leadUser?.awaitingApproval && (
                        <View
                            style={{
                                maxWidth: '80%',
                                marginHorizontal: 'auto',
                                marginTop: 50
                            }}
                        >
                            <Text style={stylesSuppHome.tasksDescription}>
                                We are waiting for {leadUserName} to approve you in
                                to their circle.
                            </Text>
                        </View>
                    )}
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
                            {tasks?.length > 0 && (
                                <View style={stylesSuppHome.tabsContentContainer}>
                                    {renderTasks(tasks)}
                                </View>
                            )}
                        </>
                    )}

                    {(taskModalVisible || myTaskModalVisible) && (
                        <Animated.View
                            style={[styles.overlay, { opacity: overlayOpacity }]}
                        />
                    )}
                </ScrollView>
            </SafeAreaView>

            {taskModalVisible && (
                <TaskDetailsModal
                    visible={taskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                />
            )}

            {myTaskModalVisible && (
                <MyTaskDetailsModal
                    visible={myTaskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                    updateTask={() => fetchTasks()}
                />
            )}

            {thankYouModalVisible && (
                <ThankYouModal
                    visible={thankYouModalVisible}
                    setVisible={setThankYouModalVisible}
                    thankYouNotifications={thankYouNotifications}
                    setThankYouNotifications={setThankYouNotifications}
                />
            )}
        </>
    );
}

const stylesSuppHome = StyleSheet.create({
    topBar: {
        paddingVertical: 18,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
        lineHeight: 22,
        marginBottom: 5
    },
    roundedRectangleContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 10,
        maxWidth: '100%'
    },
    thanksText: {
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
        color: '#737373'
    },
    nameText: {
        fontFamily: 'poppins-bold'
    },
    welcomeText: {
        fontFamily: 'poppins-bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#fff',
        marginBottom: 10
    },
    infoText: {
        fontFamily: 'poppins-regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#fff'
    },
    inspirationalQuoteText: {
        fontFamily: 'poppins-bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#fff',
        marginBottom: 10
    },
    rightImageStyle: {
        marginLeft: 20,
        width: 120,
        height: 120,
        resizeMode: 'contain'
    },
    closeIcon: {
        position: 'absolute',
        top: 15,
        right: 20
    },
    tabsContentContainer: {
        flex: 1
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
        justifyContent: 'center',
        paddingVertical: 30
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
        lineHeight: 24,
        marginBottom: 15
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'poppins-regular',
        lineHeight: 20,
        marginBottom: 10
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
    illustration: {
        width: 120,
        height: 120,
        resizeMode: 'contain'
    },
    selectedEmojiItem: {
        width: 50,
        height: 50,
        borderRadius: 100,
        borderWidth: 2,
        backgroundColor: '#fff',
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8
    },
    selectedEmojiText: {
        fontSize: Platform.OS === 'android' ? 30 : 32,
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 37 : 42
    },
    seeAllText: {
        fontFamily: 'poppins-regular',
        textAlign: 'center',
        color: '#737373',
        textDecorationLine: 'underline'
    }
});

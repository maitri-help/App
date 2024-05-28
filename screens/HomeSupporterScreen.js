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
import { getLeadUser } from '../hooks/api';
import {
    checkAuthentication,
    clearUserData,
    clearAccessToken,
    getAccessToken
} from '../authStorage';
import TaskDetailsModal from '../components/plusModalSteps/TaskDetailsModal';
import MyTaskDetailsModal from '../components/plusModalSteps/MyTaskDetailsModal';
import initalBackground from '../assets/img/welcome-bg.png';
import { Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const inspirationalQuotes = [
    'In the middle of difficulty lies opportunity. - Albert Einstein',
    'Difficult roads often lead to beautiful destinations. - Unknown',
    'When everything seems to be going against you, remember that the airplane takes off against the wind, not with it. - Henry Ford',
    'The only way to make sense out of change is to plunge into it, move with it, and join the dance. - Alan Watts',
    'Tough times never last, but tough people do. - Robert H. Schuller',
    "It's not the load that breaks you down, it's the way you carry it. - Lou Holtz",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    'The comeback is always stronger than the setback. - Unknown',
    'Fall down seven times, stand up eight. - Japanese Proverb',
    'Sometimes the darkest challenges bring the brightest blessings. - Unknown',
    'Every storm runs out of rain. - Maya Angelou',
    'Adversity introduces a man to himself. - Albert Einstein',
    'Challenges are what make life interesting and overcoming them is what makes life meaningful. - Joshua J. Marine',
    "Stars can't shine without darkness. - Unknown",
    'The wound is the place where the light enters you. - Rumi',
    'You were given this life because you are strong enough to live it. - Unknown',
    'When you come out of the storm, you won’t be the same person who walked in. - Haruki Murakami',
    'Even the darkest night will end and the sun will rise. - Victor Hugo',
    'The human spirit is stronger than anything that can happen to it. - C.C. Scott',
    'The gem cannot be polished without friction, nor man perfected without trials. - Chinese Proverb',
    "Strength grows in the moments when you think you can't go on but you keep going anyway. - Unknown",
    'The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela',
    'What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson',
    'No matter how hard the past, you can always begin again. - Buddha',
    'Out of difficulties grow miracles. - Jean de La Bruyère',
    'The greater the obstacle, the more glory in overcoming it. - Molière',
    "Life isn't about waiting for the storm to pass, it's about learning to dance in the rain. - Vivian Greene",
    'A smooth sea never made a skilled sailor. - Franklin D. Roosevelt',
    'Sometimes the bad things that happen in our lives put us directly on the path to the best things that will ever happen to us. - Unknown',
    "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't. - Rikki Rogers",
    'Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll'
];

export default function HomeSupporterScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Open');
    const [firstName, setFirstName] = useState('');
    const [userId, setUserId] = useState('');
    const [color, setColor] = useState('');
    const [emoji, setEmoji] = useState('');
    const [leadId, setLeadId] = useState('');
    const [leadFirstName, setLeadFirstName] = useState('Lead');
    const [leadLastName, setLeadLastName] = useState('name');
    const [isViewActive, setIsViewActive] = useState(true);
    const [showAllOpenTasks, setShowAllOpenTasks] = useState(false);
    const [showAllMyTasks, setShowAllMyTasks] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [randomInspirationalQuote, setRandomInspirationalQuote] =
        useState('');

    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [myTaskModalVisible, setMyTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const selectRandomInspirationalQuote = () => {
            const randomIndex = Math.floor(
                Math.random() * inspirationalQuotes.length
            );
            setRandomInspirationalQuote(inspirationalQuotes[randomIndex]);
        };

        selectRandomInspirationalQuote();
    }, [tasks.length]);

    useEffect(() => {
        async function fetchUserData() {
            setIsLoading(true);
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    setUserId(userData.userId);
                    setFirstName(userData.firstName);
                    setColor(userData.color);
                    setEmoji(userData.emoji);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.navigate('Login');
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchLeadUserData = async () => {
            try {
                const accessToken = await getAccessToken();

                const userData = await getLeadUser(accessToken);

                setLeadFirstName(userData.data[0].firstName);
                setLeadLastName(userData.data[0].lastName);
                setLeadId(userData.data[0].userId);
            } catch (error) {
                console.error('Error fetching lead user data:', error);
            }
        };

        fetchLeadUserData();
    }, []);

    async function fetchTasks() {
        try {
            if (leadId) {
                const accessToken = await getAccessToken();

                const tasksResponse = await getLeadUser(accessToken);

                setTasks(tasksResponse.data[0].tasks);
            } else {
                console.error('No user data found or leadId not available');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (leadId) fetchTasks();
        }, [leadId])
    );

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const handleTaskStatusChange = () => {
        fetchTasks();
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

    const renderTasks = (tasks = []) => {
        let filteredTasks = tasks;
        if (activeTab === 'Open') {
            filteredTasks = tasks.filter(
                (task) => task.status === 'undone' && !task.assignedUserId
            );
        } else if (activeTab === 'My') {
            filteredTasks = tasks.filter(
                (task) => task.assignedUserId && task.assignedUserId === userId
            );
        }

        if (filteredTasks.length === 0) {
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
            showAllOpenTasks || showAllMyTasks ? filteredTasks.length : 3
        );

        return (
            <View style={stylesSuppHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesSuppHome.tasksScroll}>
                    {displayedTasks.map((task) =>
                        activeTab === 'Open' ? (
                            <OpenTask
                                key={task.taskId}
                                task={task}
                                title={task.title}
                                startTime={task.startDateTime}
                                endTime={task.endDateTime}
                                category={task.category}
                                taskModal={() => setTaskModalVisible(true)}
                                onTaskItemClick={handleTaskItemClick}
                            />
                        ) : (
                            <MyTask
                                key={task.taskId}
                                task={task}
                                title={task.title}
                                firstName={
                                    task.assignee ? task.assignee.firstName : ''
                                }
                                lastName={
                                    task.assignee ? task.assignee.lastName : ''
                                }
                                startTime={task.startDateTime}
                                endTime={task.endDateTime}
                                category={task.category}
                                taskModal={() => setMyTaskModalVisible(true)}
                                onTaskItemClick={handleTaskItemClick}
                                isCheckbox={true}
                                onTaskStatusChange={handleTaskStatusChange}
                            />
                        )
                    )}
                    {(filteredTasks.length > 3 &&
                        !showAllOpenTasks &&
                        activeTab === 'Open') ||
                    (filteredTasks.length > 3 &&
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
            <SafeAreaView style={styles.safeArea}>
                <View style={stylesSuppHome.topBar}>
                    <View
                        style={[
                            stylesSuppHome.selectedEmojiItem,
                            { borderColor: color }
                        ]}
                    >
                        <Text style={stylesSuppHome.selectedEmojiText}>
                            {emoji}
                        </Text>
                    </View>
                    <View style={{ flexShrink: 1 }}>
                        <Text style={stylesSuppHome.greetingsText}>
                            Hey {firstName}
                        </Text>
                        <Text style={stylesSuppHome.thanksText}>
                            Thanks for being here for{' '}
                            <Text style={stylesSuppHome.nameText}>
                                {leadFirstName} {leadLastName}!
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
                                {tasks.length > 0 ? (
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
                    <TouchableOpacity
                        onPress={() => handleTabPress('Open')}
                        style={[
                            stylesSuppHome.tab,
                            activeTab === 'Open' && stylesSuppHome.activeTab
                        ]}
                    >
                        <Text
                            style={[
                                stylesSuppHome.tabText,
                                activeTab === 'Open' &&
                                    stylesSuppHome.activeTabText
                            ]}
                        >
                            Open tasks
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabPress('My')}
                        style={[
                            stylesSuppHome.tab,
                            activeTab === 'My' && stylesSuppHome.activeTab
                        ]}
                    >
                        <Text
                            style={[
                                stylesSuppHome.tabText,
                                activeTab === 'My' &&
                                    stylesSuppHome.activeTabText
                            ]}
                        >
                            My tasks
                        </Text>
                    </TouchableOpacity>
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
                        {tasks.length > 0 && (
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
            </SafeAreaView>

            {taskModalVisible && (
                <TaskDetailsModal
                    visible={taskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                    updateTask={() => fetchTasks()}
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
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center'
    },
    activeTab: {
        backgroundColor: '#1C4837'
    },
    tabText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 17
    },
    activeTabText: {
        color: '#fff'
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

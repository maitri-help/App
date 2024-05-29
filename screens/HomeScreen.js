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
import CustomBox from '../components/CustomBox';
import TaskItem from '../components/TaskItem';
import { getTasksForUser, getNotificationsForUser } from '../hooks/api';
import {
    checkAuthentication,
    clearUserData,
    clearAccessToken
} from '../authStorage';
import TaskModal from '../components/TaskModal';
import { useFocusEffect } from '@react-navigation/native';

const quotes = [
    'Remember to breathe today.',
    "Don't be afraid to ask for help when you need it.",
    'Your feelings are valid. Go easy on yourself.',
    'Acknowledge your feelings, feel them, but don’t become them.',
    'Practice self-care daily, a small act of kindness to yourself can go a long way.',
    'Try journaling to process your thoughts and track your progress.',
    'Be patient with yourself. Healing takes time.',
    "Focus on what you can control, and try to let go of what you can't.",
    "You don't have to be anyone else's hero. Be your own hero - whatever that means to you!",
    'Reach out to a loved one in a time of need, they’re just a phone call or text away!',
    'Forgive yourself. Forgive your body. Forgive your past mistakes and future decisions.',
    'Knowing when to take a break is a strength, not a weakness.',
    'There’s no shame in taking something for pain to help your body help you heal.',
    'You are allowed to talk to the people you love about things that are not the situation you are in.'
];

const motivationalQuotes = [
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

export default function HomeScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('All');
    const [firstName, setFirstName] = useState('');
    const [greetingText, setGreetingText] = useState('');
    const [tasks, setTasks] = useState([]);
    const [randomQuote, setRandomQuote] = useState('');
    const [randomMotivationalQuote, setRandomMotivationalQuote] = useState('');
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const [taskModalSelectedCircle, setTaskModalSelectedCircle] =
        useState('Personal');
    const [taskModalTaskName, setTaskModalTaskName] = useState('');
    const [taskModalTaskId, setTaskModalTaskId] = useState('');
    const [taskModaldescription, setTaskModalDescription] = useState('');
    const [taskModalSelectedLocation, setTaskModalSelectedLocation] =
        useState('');
    const [taskModalStartDate, setTaskModalStartDate] = useState(null);
    const [taskModalEndDate, setTaskModalEndDate] = useState(null);
    const [taskModalStartTime, setTaskModalStartTime] = useState(null);
    const [taskModalEndTime, setTaskModalEndTime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [assigneeFirstName, setAssigneeFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('');
    const [emoji, setEmoji] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [hasUnreadPendingRequest, setHasUnreadPendingRequest] =
        useState(false);

    useEffect(() => {
        const selectRandomQuote = () => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setRandomQuote(quotes[randomIndex]);
        };

        const selectRandomMotivationalQuote = () => {
            const randomIndex = Math.floor(
                Math.random() * motivationalQuotes.length
            );
            setRandomMotivationalQuote(motivationalQuotes[randomIndex]);
        };

        selectRandomQuote();
        selectRandomMotivationalQuote();
    }, []);

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
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setIsLoading(false);
        }
    }

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
                        notification.type === 'pending_request'
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

    useFocusEffect(
        React.useCallback(() => {
            fetchTasks();
            fetchNotifications();
        }, [])
    );

    useEffect(() => {
        if (taskModalVisible) {
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
    }, [taskModalVisible]);

    const handleTabPress = (tab) => {
        setActiveTab(tab);
        fetchTasks();
    };

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
    };

    const handleDateTimeSelectTask = ({ startDateTime, endDateTime }) => {
        setTaskModalStartDate(startDateTime);
        setTaskModalEndDate(endDateTime);
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

    const renderTasks = (tasks) => {
        if (tasks.length === 0) {
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

        let filteredTasks = tasks;
        switch (activeTab) {
            case 'Unassigned':
                filteredTasks = tasks.filter((task) => !task.assignee);
                break;
            case 'Personal':
                filteredTasks = tasks.filter((task) =>
                    task.circles.some(
                        (circle) => circle.circleLevel === 'Personal'
                    )
                );
                break;
            default:
                break;
        }

        filteredTasks = filteredTasks.sort((a, b) =>
            a.status === 'done' ? 1 : -1
        );

        return (
            <View style={stylesHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesHome.tasksScroll}>
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.taskId}
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
                <View style={stylesHome.boxesContainer}>
                    <ScrollView
                        horizontal={true}
                        style={stylesHome.boxesScroll}
                    >
                        <View style={{ marginLeft: 15 }} />
                        {/* <CustomBox
                        title="Rachel Green"
                        subtitle="Has completed"
                        largerText="Do the Laundry"
                        buttons={[{ title: 'Say thank you!', bgColor: '#fff', textColor: '#000' }]}
                        bgColor="#FFE8D7"
                        bgImgColor="#FFD8BC"
                    />
                    <CustomBox
                        title="You haven't approved"
                        largerText="Phoebe Buffay"
                        secondSubtitle="For a long time"
                        buttons={[
                            { title: 'Confirm', bgColor: '#D4EED0', textColor: '#000' },
                            { title: 'Decline', bgColor: '#fff', textColor: '#000' }
                        ]}
                        bgColor="#E1D0FD"
                        bgImg={3}
                        bgImgColor="#EDE3FE"
                    /> */}
                        <CustomBox
                            title="Nothing to do?"
                            buttons={[
                                {
                                    title: 'Add a new task',
                                    onPress: () =>
                                        navigation.navigate('Assignments')
                                }
                            ]}
                            bgColor="#E5F5E3"
                            bgImgColor="#D6EFD2"
                            bgImg={4}
                        />
                        <CustomBox
                            title={randomQuote}
                            bgColor="#D4E6E5"
                            bgImgColor="#B7D6D3"
                        />
                        <CustomBox
                            title={randomMotivationalQuote}
                            bgColor="#E1D0FD"
                            bgImgColor="#EDE3FE"
                            bgImg={2}
                        />
                        <CustomBox
                            title="Come add family & friends to your circles"
                            buttons={[
                                {
                                    title: 'Add a new person',
                                    bgColor: '#fff',
                                    textColor: '#000',
                                    onPress: () =>
                                        navigation.navigate('Circles')
                                }
                            ]}
                            bgColor="#FFE8D7"
                            bgImgColor="#FFD8BC"
                            bgImg={2}
                        />
                        <View style={{ marginRight: 15 }} />
                    </ScrollView>
                </View>

                <View
                    style={[stylesHome.tabsContainer, styles.contentContainer]}
                >
                    <TouchableOpacity
                        onPress={() => handleTabPress('All')}
                        style={[
                            stylesHome.tab,
                            activeTab === 'All' && stylesHome.activeTab
                        ]}
                    >
                        <Text
                            style={[
                                stylesHome.tabText,
                                activeTab === 'All' && stylesHome.activeTabText
                            ]}
                        >
                            All tasks
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabPress('Unassigned')}
                        style={[
                            stylesHome.tab,
                            activeTab === 'Unassigned' && stylesHome.activeTab
                        ]}
                    >
                        <Text
                            style={[
                                stylesHome.tabText,
                                activeTab === 'Unassigned' &&
                                    stylesHome.activeTabText
                            ]}
                        >
                            Unassigned
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabPress('Personal')}
                        style={[
                            stylesHome.tab,
                            activeTab === 'Personal' && stylesHome.activeTab
                        ]}
                    >
                        <Text
                            style={[
                                stylesHome.tabText,
                                activeTab === 'Personal' &&
                                    stylesHome.activeTabText
                            ]}
                        >
                            Personal
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
                    <View style={stylesHome.tabsContentContainer}>
                        {renderTasks(tasks)}
                    </View>
                )}
            </SafeAreaView>

            {taskModalVisible && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}

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
    boxesScroll: {
        paddingVertical: 20
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

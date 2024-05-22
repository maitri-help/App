import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Animated } from 'react-native';
import styles from '../Styles';
import MyTask from '../components/MyTask';
import MyTaskDetailsModal from '../components/plusModalSteps/MyTaskDetailsModal';
import { checkAuthentication, clearUserData, clearAccessToken, getAccessToken } from '../authStorage';
import { getLeadUser } from '../hooks/api';
import { useFocusEffect } from '@react-navigation/native';


export default function MyTasksSupporterScreen({ navigation }) {
    const [myTaskModalVisible, setMyTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [leadId, setLeadId] = useState('');
    const [userId, setUserId] = useState('');

    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    setUserId(userData.userId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.navigate('Login');
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchLeadUserData = async () => {
            try {
                const accessToken = await getAccessToken();

                const userData = await getLeadUser(accessToken);

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

    useEffect(() => {
        if (myTaskModalVisible) {
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
    }, [myTaskModalVisible]);

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleTaskModalClose = () => {
        setMyTaskModalVisible(false);
    };

    const renderTasks = (tasks) => {
        const myTasks = tasks.filter(task => task.assignedUserId && task.assignedUserId === userId);

        if (myTasks.length === 0) {
            return (
                <View style={stylesSuppMT.tasksContainer}>
                    <ScrollView contentContainerStyle={stylesSuppMT.tasksScrollEmpty}>
                        <View style={[styles.contentContainer, stylesSuppMT.tasksEmpty]}>
                            <View style={stylesSuppMT.tasksTop}>
                                <Text style={[styles.text, stylesSuppMT.tasksDescription, { marginBottom: 30 }]}>
                                    Your task list is currently empty.
                                </Text>
                                <Text style={[styles.text, stylesSuppMT.tasksDescription, { marginBottom: 60, paddingHorizontal: 30 }]}>
                                    Check the Open tasks to see where you can lend a hand.
                                </Text>
                                <Image
                                    source={require('../assets/img/mimi-illustration.png')}
                                    style={stylesSuppMT.rightImageStyle}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        return (
            <View style={stylesSuppMT.tasksContainer}>
                <ScrollView contentContainerStyle={stylesSuppMT.tasksScroll}>
                    {myTasks.map(task => (
                        <MyTask
                            key={task.taskId}
                            task={task}
                            title={task.title}
                            firstName={task.assignee ? task.assignee.firstName : ''}
                            lastName={task.assignee ? task.assignee.lastName : ''}
                            startTime={task.startDateTime}
                            endTime={task.endDateTime}
                            taskModal={() => setMyTaskModalVisible(true)}
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

                <View style={[styles.topBar, { gap: 0, flexDirection: 'row', borderBottomWidth: 0 }]}>


                    <View style={{ gap: 0, flexDirection: 'column', alignItems: 'baseline', borderBottomWidth: 0 }}>
                        <Text style={stylesSuppMT.greetingsText}>My Tasks</Text>
                        <Text style={stylesSuppMT.thanksText}>Your help makes a difference.</Text>
                    </View>
                </View>
                <View style={stylesSuppMT.tabsContentContainer}>
                    {renderTasks(tasks)}
                </View>

                {(myTaskModalVisible) && (
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
                )}
            </SafeAreaView>

            {myTaskModalVisible &&
                <MyTaskDetailsModal
                    visible={myTaskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                    updateTask={() => fetchTasks()}
                />
            }
        </>
    );
}

const stylesSuppMT = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
        lineHeight: 22,
        marginBottom: 5,
    },
    thanksText: {
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
        color: '#737373',
    },
    rightImageStyle: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    tabsContentContainer: {
        flex: 1,
    },
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    tabsContentContainer: {
        flex: 1,
    },
    tasksContainer: {
        flex: 1,
    },
    tasksScroll: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 10,
        paddingBottom: 30,
    },
    tasksScrollEmpty: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 25,
    },
    tasksEmpty: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 150,
    },
    tasks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'poppins-regular',
        lineHeight: 20,
        marginBottom: 10,
    },
    illustration: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
});
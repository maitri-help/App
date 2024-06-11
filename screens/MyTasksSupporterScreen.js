import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    Animated,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import MyTask from '../components/MyTask';
import MyTaskDetailsModal from '../components/plusModalSteps/MyTaskDetailsModal';
import { useTask } from '../context/TaskContext';
import { useUser } from '../context/UserContext';

export default function MyTasksSupporterScreen() {
    const [myTaskModalVisible, setMyTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const { tasks, isLoading } = useTask();
    const { userData } = useUser();
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (myTaskModalVisible) {
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
    }, [myTaskModalVisible]);

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleTaskModalClose = () => {
        setMyTaskModalVisible(false);
    };

    const renderTasks = (tasks) => {
        const myTasks = tasks
            ?.filter(
                (task) =>
                    task?.assignedUserId &&
                    task?.assignedUserId === userData?.userId
            )
            .sort((a, b) =>
                a.status === 'done' ? 1 : b.status === 'done' ? -1 : 0
            );

        if (myTasks?.length === 0) {
            return (
                <View style={stylesSuppMT.tasksContainer}>
                    <ScrollView
                        contentContainerStyle={stylesSuppMT.tasksScrollEmpty}
                    >
                        <View
                            style={[
                                styles.contentContainer,
                                stylesSuppMT.tasksEmpty
                            ]}
                        >
                            <View style={stylesSuppMT.tasksTop}>
                                <Text
                                    style={[
                                        styles.text,
                                        stylesSuppMT.tasksDescription,
                                        { marginBottom: 30 }
                                    ]}
                                >
                                    Your task list is currently empty.
                                </Text>
                                <Text
                                    style={[
                                        styles.text,
                                        stylesSuppMT.tasksDescription,
                                        {
                                            marginBottom: 60,
                                            paddingHorizontal: 30
                                        }
                                    ]}
                                >
                                    Check the Open tasks to see where you can
                                    lend a hand.
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
                    {myTasks?.map((task) => (
                        <MyTask
                            key={task.taskId}
                            task={task}
                            taskModal={() => setMyTaskModalVisible(true)}
                            onTaskItemClick={handleTaskItemClick}
                            isCheckbox={true}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <View
                    style={[
                        styles.topBar,
                        { gap: 0, flexDirection: 'row', borderBottomWidth: 0 }
                    ]}
                >
                    <View
                        style={{
                            gap: 0,
                            flexDirection: 'column',
                            alignItems: 'baseline',
                            borderBottomWidth: 0
                        }}
                    >
                        <Text style={stylesSuppMT.greetingsText}>My Tasks</Text>
                        <Text style={stylesSuppMT.thanksText}>
                            Your help makes a difference.
                        </Text>
                    </View>
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
                    <View style={stylesSuppMT.tabsContentContainer}>
                        {renderTasks(tasks)}
                    </View>
                )}

                {myTaskModalVisible && (
                    <Animated.View
                        style={[styles.overlay, { opacity: overlayOpacity }]}
                    />
                )}
            </SafeAreaView>

            {myTaskModalVisible && (
                <MyTaskDetailsModal
                    visible={myTaskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                />
            )}
        </>
    );
}

const stylesSuppMT = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
        lineHeight: 22,
        marginBottom: 5
    },
    thanksText: {
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
        color: '#737373'
    },
    rightImageStyle: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
    tabsContentContainer: {
        flex: 1
    },
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center'
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
        paddingTop: 150
    },
    tasks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'poppins-regular',
        lineHeight: 20,
        marginBottom: 10
    },
    illustration: {
        width: 120,
        height: 120,
        resizeMode: 'contain'
    }
});

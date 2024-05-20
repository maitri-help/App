import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import styles from '../Styles';
import OpenTask from '../components/OpenTask';
import { checkAuthentication, clearUserData, clearAccessToken, getAccessToken } from '../authStorage';
import { getLeadUser } from '../hooks/api';
import FilterIcon from '../assets/icons/filter-icon.svg';
import TaskDetailsModal from '../components/plusModalSteps/TaskDetailsModal';
import TaskFilterModal from '../components/plusModalSteps/TaskFilterModal';
import Button from '../components/Button';

export default function OpenTasksSupporterScreen({ navigation }) {
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [TimeFilterList, setTimeFilterList] = useState([]);
    const [TypeFilterList, setTypeFilterList] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [leadId, setLeadId] = useState('');

    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    const accessToken = await getAccessToken();
                    const leadUserData = await getLeadUser(accessToken);
                    setLeadId(leadUserData.data[0].userId);
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

    useEffect(() => {
        if (leadId) {
            fetchTasks();
        }
    }, [leadId]);

    const handleRemoveFilter = (filter, setSelectedFilters) => {
        setSelectedFilters(selectedFilters => selectedFilters.filter(f => f !== filter));
    };

    useEffect(() => {
        if (taskModalVisible) {
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
    }, [taskModalVisible]);

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
    };

    const handleFilter = () => {
        console.log("filter");
        console.log(TimeFilterList);
        console.log(TypeFilterList);
        setIsFilterOpen(true);
    };

    const handleFilterClose = () => {
        setIsFilterOpen(false);
    };

    const renderTasks = (tasks) => {
        const openTasks = tasks.filter(task => task.status === 'undone' && !task.assignedUserId);

        if (openTasks.length === 0) {
            return (
                <View style={stylesSuppOT.tasksContainer}>
                    <ScrollView contentContainerStyle={stylesSuppOT.tasksScrollEmpty}>
                        <View style={[styles.contentContainer, stylesSuppOT.tasksEmpty]}>
                            <View style={stylesSuppOT.tasksTop}>
                                <Text style={[styles.text, stylesSuppOT.tasksDescription, { marginBottom: 30 }]}>
                                    No open tasks yet.
                                </Text>
                                <Text style={[styles.text, stylesSuppOT.tasksDescription, { marginBottom: 60, paddingHorizontal: 30 }]}>
                                    Check back in later!
                                </Text>
                                <Image
                                    source={require('../assets/img/mimi-illustration.png')}
                                    style={stylesSuppOT.rightImageStyle}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        return (
            <>
                <View style={{ paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", justifyContent: "left", gap: 5, flexWrap: "wrap" }}>
                    {TimeFilterList.map(filter => (
                        <Button
                            key={filter}
                            buttonStyle={{
                                paddingVertical: 0,
                                width: "500",
                                height: 30,
                            }}
                            textStyle={{
                                lineHeight: 30,
                            }}
                            buttonSmall={true}
                            title={filter}
                            onPress={() => handleRemoveFilter(filter, setTimeFilterList)}
                        />
                    ))}
                    {TypeFilterList.map(filter => (
                        <Button
                            key={filter}
                            buttonStyle={{
                                paddingVertical: 0,
                                width: "500",
                                height: 30,
                            }}
                            textStyle={{
                                lineHeight: 30,
                            }}
                            buttonSmall={true}
                            title={filter}
                            onPress={() => handleRemoveFilter(filter, setTypeFilterList)}
                        />
                    ))}
                </View>

                <ScrollView contentContainerStyle={stylesSuppOT.tasksScroll}>
                    {openTasks.map((task) => (
                        <OpenTask
                            key={task.taskId}
                            task={task}
                            title={task.title}
                            firstName={task.assignee ? task.assignee.firstName : ''}
                            lastName={task.assignee ? task.assignee.lastName : ''}
                            startTime={task.startDateTime}
                            endTime={task.endDateTime}
                            emoji={task.assignee ? task.assignee.emoji : ''}
                            color={task.assignee ? task.assignee.color : ''}
                            taskModal={() => setTaskModalVisible(true)}
                            onTaskItemClick={handleTaskItemClick}
                        />
                    ))}
                </ScrollView>
            </>
        );
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.topBar, { gap: 0, flexDirection: 'row', borderBottomWidth: 0 }]}>
                    <View style={{ gap: 0, flexDirection: 'column', alignItems: 'baseline', borderBottomWidth: 0 }}>
                        <Text style={stylesSuppOT.greetingsText}>Open Tasks</Text>
                        <Text style={stylesSuppOT.thanksText}>Pick a task. Spread the love</Text>
                    </View>
                    <TouchableOpacity onPress={handleFilter} style={stylesSuppOT.filterIconWrapper}>
                        <FilterIcon width={19} height={19} style={stylesSuppOT.filterIcon}></FilterIcon>
                    </TouchableOpacity>
                </View>
                <View style={stylesSuppOT.tabsContentContainer}>
                    {renderTasks(tasks)}
                </View>

                {(isFilterOpen) && (
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
                )}
                {(taskModalVisible) && (
                    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
                )}
            </SafeAreaView>

            {isFilterOpen &&
                <TaskFilterModal
                    taskName={"Filters"}
                    onClose={handleFilterClose}
                    TimeFilterList={TimeFilterList}
                    setTimeFilterList={setTimeFilterList}
                    TypeFilterList={TypeFilterList}
                    setTypeFilterList={setTypeFilterList}
                />
            }

            {taskModalVisible &&
                <TaskDetailsModal
                    visible={taskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                    updateTask={() => fetchTasks()}
                />
            }
        </>
    );
}

const stylesSuppOT = StyleSheet.create({
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
    tasksContainer: {
        flex: 1,
    },
    tasksScroll: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: "auto",
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
    filterIconWrapper: {
        backgroundColor: '#1c4837',
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon: {
        color: '#fff',
    }
});
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
import OpenTask from '../components/OpenTask';
import FilterIcon from '../assets/icons/filter-icon.svg';
import TaskDetailsModal from '../components/plusModalSteps/TaskDetailsModal';
import TaskFilterModal from '../components/plusModalSteps/TaskFilterModal';
import Button from '../components/Button';
import { isWithinTimeframe, mergeDateAndTime } from '../helpers/date';
import { isWeekend } from 'date-fns';
import { useTask } from '../context/TaskContext';
import { fetchTasks } from '../hooks/api';
import { RefreshControl } from 'react-native-gesture-handler';
import { useUser } from '../context/UserContext';

const TIME_FILTER_HOURS = {
    Morning: { start: 6, end: 12 },
    Afternoon: { start: 12, end: 17 },
    Evening: { start: 17, end: 22 },
    Night: { start: 22, end: 6 }
};

export default function OpenTasksSupporterScreen() {
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [TimeFilterList, setTimeFilterList] = useState([]);
    const [TypeFilterList, setTypeFilterList] = useState([]);

    const [filteredTasks, setFilteredTasks] = useState([]);
    const [taskRemoval, setTaskRemoval] = useState(0);

    const { tasks, isLoading, setTasks } = useTask();
    const { userData } = useUser();

    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const [refreshing, setRefreshing] = useState(false);
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

    const handleRemoveFilter = (filter, setSelectedFilters) => {
        setSelectedFilters((selectedFilters) =>
            selectedFilters.filter((f) => f !== filter)
        );
        setTaskRemoval(taskRemoval === 0 ? 1 : 0);
    };

    useEffect(() => {
        filterTasks();
    }, [taskRemoval, tasks]);

    useEffect(() => {
        if (taskModalVisible || isFilterOpen) {
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
    }, [taskModalVisible, isFilterOpen]);

    const handleTaskItemClick = async (task) => {
        setSelectedTask(task);
    };

    const handleTaskModalClose = () => {
        setTaskModalVisible(false);
    };

    const handleFilter = () => {
        setIsFilterOpen(true);
    };

    const handleFilterClose = () => {
        filterTasks();
        setIsFilterOpen(false);
    };

    const filterTasks = () => {
        // Reset list if no filters are selected
        if (TimeFilterList.length === 0 && TypeFilterList.length === 0) {
            setFilteredTasks(tasks);
            return;
        }

        // Filter tasks based on selected filters
        const filtered = tasks.filter((task) => {
            let start;
            let end;
            if (task?.startTime) {
                start = mergeDateAndTime(task?.startDate, task?.startTime);
            } else {
                start = new Date(task.startDate);
            }

            if (task?.endTime) {
                end = mergeDateAndTime(task?.endDate, task?.endTime);
            } else {
                end = new Date(task.endDate);
            }

            const duration = (end - start) / (1000 * 60 * 60 * 24);

            let timeMatch = false;
            let typeMatch = false;

            // Time filters
            if (TimeFilterList.length > 0) {
                // Separate timeframe and weekday filters
                const dayFilters = TimeFilterList.filter(
                    (filter) => filter === 'Weekend' || filter === 'Weekday'
                );
                const frameFilters = TimeFilterList.filter(
                    (filter) => !(filter === 'Weekend' || filter === 'Weekday')
                );

                const frameMatch = frameFilters.some((filter) => {
                    if (filter in TIME_FILTER_HOURS) {
                        return (
                            duration <= 1 &&
                            (isWithinTimeframe(
                                start,
                                TIME_FILTER_HOURS[filter]
                            ) ||
                                isWithinTimeframe(
                                    end,
                                    TIME_FILTER_HOURS[filter]
                                ))
                        );
                    }
                    return false;
                });

                const dayMatch = dayFilters.some((filter) => {
                    if (filter === 'Weekend') {
                        return isWeekend(start) && isWeekend(end);
                    } else if (filter === 'Weekday') {
                        return !isWeekend(start) && !isWeekend(end);
                    }
                    return false;
                });

                // Combine timeframe and weekday filter matches
                if (frameFilters.length > 0 && dayFilters.length > 0) {
                    timeMatch = frameMatch && dayMatch;
                } else if (frameFilters.length > 0) {
                    timeMatch = frameMatch;
                } else if (dayFilters.length > 0) {
                    timeMatch = dayMatch;
                }
            }

            // Type/category filters
            if (TypeFilterList.length > 0) {
                typeMatch = TypeFilterList.includes(task.category);
            }

            // Combine time and type filter matches
            if (TimeFilterList.length > 0 && TypeFilterList.length > 0) {
                return timeMatch && typeMatch;
            } else if (TimeFilterList.length > 0) {
                return timeMatch;
            } else if (TypeFilterList.length > 0) {
                return typeMatch;
            }
            return false;
        });

        setFilteredTasks(filtered);
    };

    const renderTasks = (tasks) => {
        const openTasks = tasks?.filter(
            (task) => task.status === 'undone' && !task.assignedUserId
        );

        return (
            <>
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        justifyContent: 'left',
                        gap: 5,
                        flexWrap: 'wrap'
                    }}
                >
                    {TimeFilterList.map((filter) => (
                        <Button
                            key={filter}
                            buttonStyle={{
                                paddingVertical: 0,
                                paddingLeft: 12,
                                paddingRight: 6,
                                height: 30,
                                backgroundColor: '#fff',
                                borderRadius: 100
                            }}
                            textStyle={{
                                lineHeight: 30,
                                color: '#1C4837'
                            }}
                            buttonSmall={true}
                            closeIcon={true}
                            title={filter}
                            onPress={() =>
                                handleRemoveFilter(filter, setTimeFilterList)
                            }
                        />
                    ))}
                    {TypeFilterList.map((filter) => (
                        <Button
                            key={filter}
                            buttonStyle={{
                                paddingVertical: 0,
                                paddingLeft: 12,
                                paddingRight: 6,
                                height: 30,
                                backgroundColor: '#fff',
                                borderRadius: 100
                            }}
                            textStyle={{
                                lineHeight: 30,
                                color: '#1C4837'
                            }}
                            buttonSmall={true}
                            closeIcon={true}
                            title={filter}
                            onPress={() =>
                                handleRemoveFilter(filter, setTypeFilterList)
                            }
                        />
                    ))}
                </View>

                {openTasks.length === 0 ? (
                    <ScrollView
                        contentContainerStyle={stylesSuppOT.tasksScrollEmpty}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <View
                            style={[
                                styles.contentContainer,
                                stylesSuppOT.tasksEmpty
                            ]}
                        >
                            <View style={stylesSuppOT.tasksTop}>
                                {TimeFilterList.length > 0 ||
                                TypeFilterList.length > 0 ? (
                                    <>
                                        <Text
                                            style={[
                                                styles.text,
                                                stylesSuppOT.tasksDescription,
                                                { marginBottom: 30 }
                                            ]}
                                        >
                                            No open tasks with the selected
                                            filters.
                                        </Text>
                                        <Text
                                            style={[
                                                styles.text,
                                                stylesSuppOT.tasksDescription,
                                                {
                                                    marginBottom: 60,
                                                    paddingHorizontal: 30
                                                }
                                            ]}
                                        >
                                            Try removing some filters!
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            style={[
                                                styles.text,
                                                stylesSuppOT.tasksDescription,
                                                { marginBottom: 30 }
                                            ]}
                                        >
                                            No open tasks yet.
                                        </Text>
                                        <Text
                                            style={[
                                                styles.text,
                                                stylesSuppOT.tasksDescription,
                                                {
                                                    marginBottom: 60,
                                                    paddingHorizontal: 30
                                                }
                                            ]}
                                        >
                                            Check back in later!
                                        </Text>
                                    </>
                                )}

                                <Image
                                    source={require('../assets/img/mimi-illustration.png')}
                                    style={stylesSuppOT.rightImageStyle}
                                />
                            </View>
                        </View>
                    </ScrollView>
                ) : (
                    <ScrollView
                        contentContainerStyle={stylesSuppOT.tasksScroll}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {openTasks.map((task) => (
                            <OpenTask
                                key={task.taskId}
                                task={task}
                                taskModal={() => setTaskModalVisible(true)}
                                onTaskItemClick={handleTaskItemClick}
                            />
                        ))}
                    </ScrollView>
                )}
            </>
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
                        <Text style={stylesSuppOT.greetingsText}>
                            Open Tasks
                        </Text>
                        <Text style={stylesSuppOT.thanksText}>
                            Pick a task. Spread the love
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleFilter}
                        style={stylesSuppOT.filterIconWrapper}
                    >
                        <FilterIcon
                            width={19}
                            height={19}
                            style={stylesSuppOT.filterIcon}
                        ></FilterIcon>
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
                    <View style={stylesSuppOT.tabsContentContainer}>
                        {renderTasks(filteredTasks)}
                    </View>
                )}

                {isFilterOpen && (
                    <Animated.View
                        style={[styles.overlay, { opacity: overlayOpacity }]}
                    />
                )}
                {taskModalVisible && (
                    <Animated.View
                        style={[styles.overlay, { opacity: overlayOpacity }]}
                    />
                )}
            </SafeAreaView>

            {isFilterOpen && (
                <TaskFilterModal
                    taskName={'Filters'}
                    visible={isFilterOpen}
                    onClose={handleFilterClose}
                    TimeFilterList={TimeFilterList}
                    setTimeFilterList={setTimeFilterList}
                    TypeFilterList={TypeFilterList}
                    setTypeFilterList={setTypeFilterList}
                    taskRemoval={taskRemoval}
                    setTaskRemoval={setTaskRemoval}
                />
            )}

            {taskModalVisible && (
                <TaskDetailsModal
                    visible={taskModalVisible}
                    selectedTask={selectedTask}
                    onClose={handleTaskModalClose}
                />
            )}
        </>
    );
}

const stylesSuppOT = StyleSheet.create({
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
    tasksContainer: {
        flex: 1
    },
    tasksScroll: {
        gap: 15,
        paddingHorizontal: 25,
        paddingVertical: 15
    },
    tasksScrollEmpty: {
        flex: 1,
        paddingVertical: 15,
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
    },
    filterIconWrapper: {
        backgroundColor: '#1c4837',
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterIcon: {
        color: '#fff',
        pointerEvents: 'none'
    }
});

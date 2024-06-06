import React, { useRef, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import GridCalendar from './GridCalendar';
import { formatDate, isDateInRange } from '../../helpers/date';
import TaskItem from '../TaskItem';
import Styles from '../../Styles';

const MonthView = ({
    tasks,
    selectedDate,
    setSelectedDate,
    setTaskModalVisible,
    handleTaskStatusChange,
    handleTaskItemClick,
    activeTab,
    isLoading
}) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const flatListRef = useRef(null);

    const handleTodayPress = () => {
        const today = new Date();
        const todayFormatted = formatDate(today, {
            formatString: 'yyyy-MM-dd'
        });

        setSelectedDate(todayFormatted);
        setCurrentMonth(today.getMonth() + 1);
        setCurrentYear(today.getFullYear());
    };

    const handleDateSelection = (date) => {
        const newDate = new Date(date);
        const dateFormatted = formatDate(newDate, {
            formatString: 'yyyy-MM-dd'
        });
        setSelectedDate(dateFormatted);
    };

    const filteredTasks =
        activeTab === 'Month'
            ? tasks.filter((task) =>
                  isDateInRange(selectedDate, task.startDate, task.endDate)
              )
            : tasks;

    // Sort tasks to ensure done tasks are at the bottom
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') return 1;
        if (a.status !== 'done' && b.status === 'done') return -1;
        return 0;
    });

    return (
        <View style={stylesCal.container}>
            <View style={{ paddingHorizontal: 25 }}>
                <TouchableOpacity
                    onPress={handleTodayPress}
                    style={stylesCal.todayWrapper}
                >
                    <Text style={stylesCal.today}>Today</Text>
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 25 }}>
                <GridCalendar
                    setDate={handleDateSelection}
                    selectedDate={selectedDate}
                    currentYearProp={currentYear}
                    currentMonthProp={currentMonth}
                    setCurrentYear={setCurrentYear}
                    setCurrentMonth={setCurrentMonth}
                    tasks={tasks}
                />
            </View>
            {filteredTasks.length === 0 ? (
                <View style={stylesCal.calendarEmpty}>
                    <View style={stylesCal.calendarEmptyImgWrapper}>
                        <Image
                            source={require('../../assets/img/tasks-placeholder.png')}
                            style={stylesCal.calendarEmptyImg}
                        />
                    </View>
                    <Text style={stylesCal.calendarEmptyText}>
                        {!isLoading && tasks.length
                            ? 'No tasks on this date'
                            : 'Your list is empty'}
                    </Text>
                    <Text style={stylesCal.calendarEmptyTitle}>
                        Click here to add your first task
                    </Text>
                    <Image
                        source={require('../../assets/img/purple-arrow-right.png')}
                        style={stylesCal.calendarEmptyArrow}
                    />
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={[
                        Styles.contentContainer,
                        stylesCal.tasksWrapper
                    ]}
                    data={sortedTasks}
                    ref={flatListRef}
                    keyExtractor={(item) => item.taskId}
                    renderItem={({ item }) => (
                        <TaskItem
                            key={item.taskId}
                            task={item}
                            taskModal={() => setTaskModalVisible(true)}
                            onTaskItemClick={handleTaskItemClick}
                            isCheckbox
                            onTaskStatusChange={handleTaskStatusChange}
                        />
                    )}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise((resolve) =>
                            setTimeout(resolve, 100)
                        );
                        wait.then(() => {
                            if (info.index < sortedTasks.length) {
                                flatListRef.current?.scrollToIndex({
                                    index: info.index,
                                    animated: true
                                });
                            }
                        });
                    }}
                />
            )}
        </View>
    );
};

export default MonthView;

const stylesCal = StyleSheet.create({
    container: {
        flex: 1
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
    tasksWrapper: {
        paddingTop: 20,
        paddingBottom: 30,
        gap: 15,
        flexGrow: 1
    },
    calendarEmpty: {
        position: 'relative',
        paddingBottom: 35,
        flexGrow: 1,
        justifyContent: 'flex-end'
    },
    calendarEmptyImgWrapper: {
        marginVertical: 20
    },
    calendarEmptyImg: {
        width: 180,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    calendarEmptyText: {
        textAlign: 'center',
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 5
    },
    calendarEmptyTitle: {
        textAlign: 'center',
        color: '#000',
        fontFamily: 'poppins-medium',
        fontSize: 14,
        lineHeight: 18
    },
    calendarEmptyArrow: {
        position: 'absolute',
        bottom: 11,
        right: 71,
        width: 60,
        height: 15,
        resizeMode: 'contain'
    }
});

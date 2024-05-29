import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function WeekCalendar({
    defaultDate,
    setDate,
    setWeekStartDate,
    weekSelectedDate,
    tasks
}) {
    const [weekDates, setWeekDates] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(2);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        updateWeekDates(defaultDate);
    }, [defaultDate, weekSelectedDate]);

    const updateWeekDates = (currentDate) => {
        const weeks = [];
        for (let weekOffset = -2; weekOffset <= 2; weekOffset++) {
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(
                weekStartDate.getDate() -
                    weekStartDate.getDay() +
                    1 +
                    weekOffset * 7
            );
            const week = [];
            for (let i = 0; i < 7; i++) {
                const day = new Date(weekStartDate);
                day.setDate(weekStartDate.getDate() + i);
                const hasTask = tasks.some((task) => {
                    const taskStartDate = new Date(task.startDateTime);
                    const taskEndDate = new Date(task.endDateTime);
                    return day >= taskStartDate && day <= taskEndDate;
                });
                const hasStartTask = tasks.some((task) => {
                    const taskStartDate = new Date(task.startDateTime);
                    return day.toDateString() === taskStartDate.toDateString();
                });
                week.push({
                    date: day,
                    dayOfWeek: days[i],
                    selected:
                        day.toDateString() ===
                        new Date(weekSelectedDate).toDateString(),
                    hasTask: hasTask,
                    hasStartTask: hasStartTask
                });
            }
            weeks.push(week);
        }
        setWeekDates(weeks);
        setWeekStartDate(weeks[currentWeekIndex][0].date);
    };

    const handleDateSelection = (selectedDate) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        setDate(formattedDate);

        setWeekDates(
            weekDates.map((week) =>
                week.map((day) => ({
                    ...day,
                    selected:
                        day.date.toDateString() === selectedDate.toDateString()
                }))
            )
        );
    };

    const handleScroll = (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newWeekIndex = Math.round(offsetX / 350); // assuming each week view is 350px wide
        if (newWeekIndex !== currentWeekIndex) {
            setCurrentWeekIndex(newWeekIndex);
            const newDate = new Date(defaultDate);
            newDate.setDate(
                defaultDate.getDate() + (newWeekIndex - currentWeekIndex) * 7
            );
            updateWeekDates(newDate);
        }
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={[styles.container, { maxWidth: 350, alignSelf: 'center' }]}
            contentContainerStyle={styles.scrollViewContent}
        >
            {weekDates.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekContainer}>
                    {week.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleDateSelection(day.date)}
                            style={[
                                styles.dateContainer,
                                day.selected && { backgroundColor: '#1C4837' }
                            ]}
                        >
                            <Text style={styles.dayOfWeek(day.selected)}>
                                {day.dayOfWeek}
                            </Text>
                            <Text style={styles.date(day.selected)}>
                                {day.date.getDate()}
                            </Text>
                            {(day.hasTask || day.hasStartTask) && (
                                <View style={styles.dot} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 25
    },
    scrollViewContent: {
        alignItems: 'center'
    },
    weekContainer: {
        flexDirection: 'row',
        width: 350, // Assuming each week container is 350px wide
        justifyContent: 'space-between'
    },
    dateContainer: {
        height: 70,
        width: 50,
        borderRadius: 50,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 11
    },
    dayOfWeek: (selected) => ({
        fontFamily: selected ? 'poppins-semibold' : 'poppins-medium',
        fontSize: 14,
        lineHeight: 18,
        color: selected ? '#fff' : '#000'
    }),
    date: (selected) => ({
        fontFamily: selected ? 'poppins-semibold' : 'poppins-light',
        fontSize: 14,
        lineHeight: 18,
        color: selected ? '#fff' : '#000'
    }),
    dot: {
        width: 4,
        height: 4,
        backgroundColor: '#D5D5D5',
        borderRadius: 2,
        position: 'absolute',
        bottom: 7,
        right: 23
    }
});

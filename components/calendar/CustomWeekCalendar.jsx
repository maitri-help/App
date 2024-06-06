import React, { useRef, useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    ExpandableCalendar,
    AgendaList,
    CalendarProvider,
    WeekCalendar
} from 'react-native-calendars';
import { CALENDAR_THEME_SETTINGS } from '../../constants/calendar';
import AgendaItem from './AgendaItem';
import {
    generateAgendaItems,
    getMarkedDates
} from '../../helpers/agendaItems.helpers';

export default function CustomWeekCalendar({
    tasks,
    handleTaskItemClick,
    setTaskModalVisible,
    handleTaskStatusChange
}) {
    const weekView = true;

    const agendaItems = generateAgendaItems(tasks);

    const marked = useRef(getMarkedDates(agendaItems));

    const [currentMonth, setCurrentMonth] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    useEffect(() => {
        const todayDate = new Date();
        const month = todayDate.toLocaleString('default', { month: 'long' });
        setCurrentMonth(month);
    }, []);

    const renderItem = useCallback(({ item }) => {
        return (
            <AgendaItem
                item={item}
                handleTaskItemClick={handleTaskItemClick}
                setTaskModalVisible={setTaskModalVisible}
                handleTaskStatusChange={handleTaskStatusChange}
            />
        );
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <CalendarProvider
                date={agendaItems[1]?.title}
                showTodayButton
                theme={CALENDAR_THEME_SETTINGS}
            >
                <View style={{ paddingHorizontal: 25, paddingVertical: 5 }}>
                    <Text style={styles.monthHeading}>{currentMonth}</Text>
                </View>
                {weekView ? (
                    <WeekCalendar
                        firstDay={1}
                        style={styles.calendar}
                        theme={CALENDAR_THEME_SETTINGS}
                        markedDates={{
                            ...marked.current,
                            [selectedDate]: {
                                selected: true,
                                selectedColor: '#1C4837'
                            }
                        }}
                        staticHeader={false}
                        showWeekNumbers
                        // onVisibleMonthsChange={(months) =>
                        //     handleMonthChange(months)
                        // }
                        //onMonthChange={(month) => handleMonthChange(month)}
                        //numberOfDays={7}
                        onDayPress={onDayPress}
                    />
                ) : (
                    <ExpandableCalendar
                        hideArrows
                        theme={CALENDAR_THEME_SETTINGS}
                        firstDay={1}
                        markedDates={marked.current}
                    />
                )}
                <AgendaList
                    sections={agendaItems}
                    renderItem={renderItem}
                    sectionStyle={styles.section}
                />
            </CalendarProvider>
        </View>
    );
}
const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 10,
        paddingRight: 10
    },
    monthHeading: {
        fontFamily: 'poppins-medium',
        fontSize: 18,
        lineHeight: 24,
        color: '#000'
    },
    section: {
        backgroundColor: '#fff',
        color: 'grey',
        textTransform: 'capitalize'
    }
});

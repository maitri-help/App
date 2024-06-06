import React, { useRef, useCallback, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    ExpandableCalendar,
    AgendaList,
    CalendarProvider
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
    //const weekView = false;

    const agendaItems = generateAgendaItems(tasks);

    const marked = useRef(getMarkedDates(agendaItems));

    const [selectedDate, setSelectedDate] = useState('');

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

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
                <ExpandableCalendar
                    hideArrows
                    theme={CALENDAR_THEME_SETTINGS}
                    firstDay={1}
                    markedDates={{
                        ...marked.current
                        // [selectedDate]: {
                        //     selected: true,
                        //     selectedColor: '#1C4837',
                        //     dotColor: 'white'
                        // }
                    }}
                    hideKnob
                    onDayPress={onDayPress}
                />

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

import React, { useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
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
                {weekView ? (
                    <WeekCalendar firstDay={1} markedDates={marked.current} />
                ) : (
                    <ExpandableCalendar
                        hideArrows
                        headerStyle={styles.header}
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
        paddingLeft: 20,
        paddingRight: 20
    },
    header: {
        backgroundColor: 'red'
    },
    section: {
        backgroundColor: '#fff',
        color: 'grey',
        textTransform: 'capitalize'
    }
});

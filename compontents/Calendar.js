import React, { useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';
import testIDs from '../testIDs';
import { agendaItems, getMarkedDates } from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import { getTheme, themeColor, lightThemeColor } from '../mocks/theme';

const ITEMS = agendaItems;

const ExpandableCalendarScreen = (props) => {
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });

  const renderItem = useCallback(({ item, section }) => {
    const isLastItemInSection = section.data.indexOf(item) === section.data.length - 1;
    return <AgendaItem item={item} isLastItemInSection={isLastItemInSection} />;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      showTodayButton
      theme={todayBtnTheme.current}
    >
      <ExpandableCalendar
        testID={testIDs.expandableCalendar.CONTAINER}
        theme={theme.current}
        firstDay={1}
        markedDates={marked.current}
        initialPosition='open'
      />
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        sectionStyle={styles.section}
      />
    </CalendarProvider>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  section: {
    backgroundColor: lightThemeColor,
    color: '#737373',
    textTransform: 'capitalize',
  }
});
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import LeftChevron from '../../assets/icons/chevron-left-icon.svg';
import RightChevron from '../../assets/icons/chevron-right-icon.svg';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const monthNum = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function GridCalendar({ setDate, selectedDate, currentYearProp, currentMonthProp, setCurrentYear, setCurrentMonth, setWeekStartDate, tasks }) {
  const [monthDates, setMonthDates] = useState([]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month - 1, 1).getDay();
    };

    const firstDayOfWeek = getFirstDayOfMonth(currentYearProp, currentMonthProp);

    const weekStartDate = new Date(selectedDate);
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());

    const getLastDayOfMonth = (year, month) => {
      return new Date(year, month, 0).getDate();
    };

    const getLastMonth = (year, month) => {
      if (month === 1) return 12;
      else return month - 1;
    };

    const lastDayOfPrevMonth = getLastDayOfMonth(
      currentYearProp,
      getLastMonth(currentYearProp, currentMonthProp)
    );
    const totalDaysInMonth = getLastDayOfMonth(currentYearProp, currentMonthProp);

    const prevMonthDays = [];
    for (
      let i = lastDayOfPrevMonth - firstDayOfWeek + 1;
      i <= lastDayOfPrevMonth;
      i++
    ) {
      prevMonthDays.push({ date: i, selected: false, disabled: true });
    }

    const currentYear = parseInt(selectedDate.split('-')[0]);
    const currentMonth = parseInt(selectedDate.split('-')[1]);
    const currentDay = parseInt(selectedDate.split('-')[2]);

    const isSameDate = currentYear === currentYearProp &&
      currentMonth === currentMonthProp;

    const currentMonthDays = [];
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currentDate = new Date(currentYearProp, currentMonthProp - 1, i);
      const isToday = currentDate.toDateString() === new Date().toDateString();

      currentMonthDays.push({
        date: i,
        selected: isSameDate && i === currentDay,
        disabled: false,
        hasTask: tasks.some(task => {
          const taskDate = new Date(task.startDateTime).getDate();
          return taskDate === i;
        }),
        isToday: isToday
      });
    }

    const nextMonthDays = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({ date: i, selected: false, disabled: true });
    }

    setMonthDates([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);

    setWeekStartDate(weekStartDate);
  }, [currentYearProp, currentMonthProp, selectedDate, tasks]);

  const nextMonth = () => {
    if (currentMonthProp === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYearProp + 1);
    } else {
      setCurrentMonth(currentMonthProp + 1);
    }
  };

  const previousMonth = () => {
    if (currentMonthProp === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYearProp - 1);
    } else {
      setCurrentMonth(currentMonthProp - 1);
    }
  };

  const selectDate = (selectedDate) => {
    setDate(selectedDate);
  };

  const renderDays = ({ item }) => (
    <View style={styles.dayWrapper}>
      <Text style={styles.day}>{item}</Text>
    </View>
  );

  const renderDates = ({ item }) => (
    <View style={styles.dateWrapper}>
      <TouchableOpacity
        style={styles.dateContainer(item)}
        onPress={() => selectDate(`${currentYearProp}-${currentMonthProp}-${item.date}`)}
        disabled={item.disabled}
      >
        <Text style={[styles.date(item), item.disabled && styles.disabledDate]}>
          {item.date}
        </Text>
        {item.hasTask && !item.isToday && <View style={styles.dot} />}
        {item.isToday && <View style={[styles.dot, styles.dotToday]} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.calendar}>
      <View style={[styles.calendarTop]}>
        <Text style={styles.monthHeading}>
          {months[currentMonthProp - 1]} {currentYearProp}
        </Text>

        <TouchableOpacity onPress={previousMonth} style={styles.chevronWrapper}>
          <LeftChevron style={styles.chevron} />
        </TouchableOpacity>

        <TouchableOpacity onPress={nextMonth} style={styles.chevronWrapper}>
          <RightChevron style={styles.chevron} />
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={7}
        data={days}
        renderItem={renderDays}
        style={styles.daysWrapper}
        scrollEnabled={false}
      />

      <FlatList
        numColumns={7}
        data={monthDates}
        renderItem={renderDates}
        style={styles.datesWrapper}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8.00,
    elevation: 14,
    marginTop: 3,
    marginBottom: 25,
    paddingTop: 7,
    paddingBottom: 10,
  },
  calendarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    paddingVertical: 5,
    paddingHorizontal: 13,
  },
  monthHeading: {
    flex: 1,
    fontFamily: 'poppins-medium',
    fontSize: 18,
    lineHeight: 24,
    color: '#000',
  },
  chevronWrapper: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -5,
    marginRight: -10,
  },
  chevron: {
    height: 14,
    width: 14,
    color: '#000',
  },
  dateWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 10,
  },
  daysWrapper: {
    marginTop: 5,
    paddingHorizontal: 5,
  },
  datesWrapper: {
    paddingHorizontal: 5,
  },
  dateContainer: item => ({
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: item.selected ? '#1C4837' : '#fff',
  }),
  date: item => ({
    fontFamily: item.selected ? 'poppins-semibold' : 'poppins-regular',
    fontSize: 14,
    lineHeight: 20,
    color: item.selected ? '#fff' : '#000',
  }),
  disabledDate: {
    color: '#A4A4A4',
  },
  day: {
    fontSize: 12,
    color: '#8A8A8E',
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: '#D5D5D5',
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
    right: 14,
  },
  dotToday: {
    backgroundColor: '#B22525',
  }
});


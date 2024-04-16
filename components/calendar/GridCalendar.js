import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
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

export default function GridCalendar({ setDate }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [monthDates, setMonthDates] = useState([]);

  useEffect(() => {
    const getLastDayOfMonth = (year, month) => {
      return new Date(year, month, 0).getDate();
    };

    const getLastMonth = (year, month) => {
      if (month === 1) return 12;
      else return month - 1;
    };

    const getFirstDayOfWeek = (year, month) => {
      let firstDay = new Date(year, month - 1, 1).getDay();
      if (firstDay === 0) {
        firstDay = 6;
      } else {
        firstDay -= 1;
      }
      return firstDay;
    };

    const lastDayOfPrevMonth = getLastDayOfMonth(
      currentYear,
      getLastMonth(currentYear, currentMonth),
    );
    const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
    const totalDaysInMonth = getLastDayOfMonth(currentYear, currentMonth);

    const prevMonthDays = [];
    for (
      let i = lastDayOfPrevMonth - firstDayOfWeek + 1;
      i <= lastDayOfPrevMonth;
      i++
    ) {
      prevMonthDays.push({ date: i, selected: false, disabled: true });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= totalDaysInMonth; i++) {
      currentMonthDays.push({ date: i, selected: false, disabled: false });
    }

    const nextMonthDays = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({ date: i, selected: false, disabled: true });
    }

    const currentDate = new Date().getDate();

    const currentDateItem = currentMonthDays.find(
      item => item.date === currentDate,
    );

    if (currentDateItem && !currentDateItem.disabled) {
      currentDateItem.selected = true;
    }

    setMonthDates([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  }, [currentYear, currentMonth]);

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const previousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const selectDate = selectedDate => {
    const formattedDate = `${currentYear}-${monthNum[currentMonth - 1]
      }-${selectedDate}`;
    setDate(formattedDate);
    setMonthDates(
      monthDates.map(dateItem => {
        dateItem.selected =
          dateItem.date === selectedDate && !dateItem.disabled;
        console.log('dateItem', dateItem);
        return dateItem;
      }),
    );
  };

  const renderDays = ({ item }) => (
    <View style={styles.dateWrapper}>
      <Text style={styles.day}>{item}</Text>
    </View>
  );

  const renderDates = ({ item }) => (
    <View style={styles.dateWrapper}>
      <TouchableOpacity
        style={styles.dateContainer(item)}
        onPress={() => selectDate(item.date)}
        disabled={item.disabled}>
        <Text style={styles.date(item)}>{item.date}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.calendar}>
      <View style={[styles.calendarTop]}>
        <Text style={styles.monthHeading}>
          {months[currentMonth - 1]} {currentYear}
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
        style={{ marginVertical: 10 }}
      />

      <FlatList numColumns={7} data={monthDates} renderItem={renderDates} />
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8.00,
    elevation: 8,
    marginTop: 5,
    marginBottom: 25,
    paddingVertical: 5,
  },
  calendarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  monthHeading: {
    flex: 1,
    fontSize: 18,
    color: '#000',
  },
  chevronWrapper: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: -5,
  },
  chevron: {
    height: 14,
    width: 14,
    color: '#000',
  },
  dateWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: item => ({
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: item.selected ? '#1C4837' : '#fff',
    opacity: item.disabled ? 0.5 : 1,
  }),
  date: item => ({
    fontSize: 14,
    color: item.selected ? '#fff' : '#000',
    marginBottom: -2,
  }),
  day: {
    fontSize: 12,
    color: '#ccc',
  },
});


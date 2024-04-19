import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function WeekCalendar({ defaultDate, setDate, setWeekStartDate, weekSelectedDate }) {
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    updateWeekDates(defaultDate);
  }, [defaultDate]);

  const updateWeekDates = (currentDate) => {
    const formattedDates = [];
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStartDate);
      day.setDate(weekStartDate.getDate() + i);
      formattedDates.push({
        date: day.getDate(),
        dayOfWeek: days[i],
        selected: day.getTime() === currentDate.getTime(),
      });
    }
    setWeekStartDate(weekStartDate);
    setWeekDates(formattedDates);
  };

  const handleDateSelection = (selectedDate) => {
    const formattedDate = `${defaultDate.getFullYear()}-${(defaultDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
    setDate(formattedDate);

    setWeekDates(
      weekDates.map((day) => ({
        ...day,
        selected: day.date === selectedDate,
      }))
    );
  };

  return (
    <View style={[styles.container, styles.scrollViewContent]}>
      {weekDates.map((day, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleDateSelection(day.date)}
          style={[
            styles.dateContainer,
            day.selected && { backgroundColor: '#1C4837' },
          ]}
        >
          <Text style={styles.dayOfWeek(day.selected)}>{day.dayOfWeek}</Text>
          <Text style={styles.date(day.selected)}>{day.date}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 25,
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    height: 70,
    width: 50,
    borderRadius: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 11,
  },
  dayOfWeek: selected => ({
    fontFamily: selected ? 'poppins-semibold' : 'poppins-medium',
    fontSize: 14,
    lineHeight: 18,
    color: selected ? '#fff' : '#000',
  }),
  date: selected => ({
    fontFamily: selected ? 'poppins-semibold' : 'poppins-light',
    fontSize: 14,
    lineHeight: 18,
    color: selected ? '#fff' : '#000',
  }),
});

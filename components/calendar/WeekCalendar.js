import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function WeekCalendar({ date, setDate }) {
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);
    const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    endOfWeek.setDate(diff + 6);

    const formattedDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(diff + i);
      formattedDates.push({
        date: day.getDate(),
        dayOfWeek: days[i],
        selected: day.getDate() === today.getDate(),
      });
    }
    setWeekDates(formattedDates);
  }, []);

  const handleDateSelection = selectedDate => {
    setDate(selectedDate);
    setWeekDates(
      weekDates.map(date => ({
        ...date,
        selected: date.date === selectedDate,
      })),
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
          ]}>
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
    paddingTop: 5,
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

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ExpandableCalendarScreen from '../compontents/Calendar';
import styles from '../Styles';

export default function AssignmentsScreen() {
    return (
        <View style={styles.container}>
            <View style={stylesCal.calendarContainer}>
                <ExpandableCalendarScreen />
            </View>
        </View>
    );
}

const stylesCal = StyleSheet.create({
    calendarContainer: {
        paddingTop: 80,
    },
});
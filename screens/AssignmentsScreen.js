import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ExpandableCalendarScreen from '../compontents/Calendar';
import styles from '../Styles';

export default function AssignmentsScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={stylesCal.calendarContainer}>
                    <ExpandableCalendarScreen />
                </View>
            </View>
        </SafeAreaView>
    );
}

const stylesCal = StyleSheet.create({
    calendarContainer: {
        paddingTop: 20,
    },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../Styles';
import { AppointmentList } from '../data/appointments';
import AppointmentItem from '../components/AppointmentItem';
import PlusModal from '../components/PlusModal';
import GridCalendar, { monthNum } from '../components/calendar/GridCalendar';
import WeekCalendar from '../components/calendar/WeekCalendar';

export default function AssignmentsScreen() {
    const [activeTab, setActiveTab] = useState('Month');
    const [plusModal, setPlusModal] = useState(false);
    const [SelectedDateGrid, setSelectedDateGrid] = useState(
        `${new Date().getFullYear()}-${monthNum[new Date().getMonth()]
        }-${new Date().getDate()}`,
    );

    const handleTodayPress = () => { };

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={stylesCal.calendarContainer}>
                <View style={[styles.contentContainer, stylesCal.calendarWrapper]}>
                    <View style={stylesCal.tabs}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => setActiveTab('Month')} style={[stylesCal.tab, activeTab === 'Month' ? stylesCal.tabActive : '']}>
                            <Text style={[stylesCal.tabText, activeTab === 'Month' ? stylesCal.tabActiveText : '']}>Month</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => setActiveTab('Week')} style={[stylesCal.tab, activeTab === 'Week' ? stylesCal.tabActive : '']}>
                            <Text style={[stylesCal.tabText, activeTab === 'Week' ? stylesCal.tabActiveText : '']}>Week</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleTodayPress}
                        style={stylesCal.todayWrapper}>
                        <Text style={stylesCal.today}>Today</Text>
                    </TouchableOpacity>

                    {activeTab === 'Month' ? (
                        <GridCalendar date={SelectedDateGrid} setDate={setSelectedDateGrid} />
                    ) : (
                        <WeekCalendar date={SelectedDateGrid} setDate={setSelectedDateGrid} />
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={stylesCal.calendarScroll}>

                <View style={[styles.contentContainer, stylesCal.appointmentWrapper]}>
                    {AppointmentList.map((appointment, index) => (
                        <AppointmentItem key={index} appointment={appointment} />
                    ))}
                </View>

            </ScrollView>

            <PlusModal plusModal={plusModal} setPlusModal={setPlusModal} style={stylesCal.plusModal} />



        </SafeAreaView>
    );
}

const stylesCal = StyleSheet.create({
    calendarContainer: {
        position: 'relative',
    },
    plusModal: {
        position: 'absolute',
        right: 10,
        bottom: 30,
    },
    calendarWrapper: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.00,
        elevation: 8,
    },
    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E5E5',
        gap: 10,
        paddingTop: 20,
        paddingBottom: 18,
    },
    tab: {
        borderWidth: 1,
        borderColor: '#1C4837',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
    },
    tabActive: {
        backgroundColor: '#1C4837',
    },
    tabText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 18,
    },
    tabActiveText: {
        color: '#fff'
    },
    todayWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    today: {
        color: '#737373',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
    appointmentWrapper: {
        paddingVertical: 20,
    },
});
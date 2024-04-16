import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native';
import styles from '../Styles';
import { AppointmentList } from '../data/appointments';
import AppointmentItem from '../components/AppointmentItem';
import PlusModal from '../components/PlusModal';
import GridCalendar, { monthNum } from '../components/calendar/GridCalendar';
import WeekCalendar from '../components/calendar/WeekCalendar';
import PlusIcon from '../assets/icons/plus-icon.svg';

export default function AssignmentsScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Month');
    const [plusModalVisible, setPlusModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const [SelectedDateGrid, setSelectedDateGrid] = useState(
        `${new Date().getFullYear()}-${monthNum[new Date().getMonth()]
        }-${new Date().getDate()}`,
    );

    useEffect(() => {
        if (plusModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [plusModalVisible]);

    const handleTodayPress = () => { };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>

                <View style={stylesCal.calendarContainer}>
                    <View style={stylesCal.whiteSpace}></View>
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

                <View style={stylesCal.floatingButtonWrapper}>
                    <TouchableOpacity
                        onPress={() => setPlusModalVisible(true)}
                        style={styles.floatingButton}
                        activeOpacity={1}
                    >
                        <PlusIcon color={'#fff'} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>

            {(plusModalVisible) && (
                <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
            )}

            <PlusModal
                visible={plusModalVisible}
                onClose={() => setPlusModalVisible(false)}
                navigation={navigation}
            />
        </>
    );
}

const stylesCal = StyleSheet.create({
    calendarContainer: {
        position: 'relative',
        zIndex: 2,
    },
    whiteSpace: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        zIndex: 3,
        marginBottom: -1,
    },
    calendarScroll: {
        position: 'relative',
        zIndex: 1,
    },
    calendarWrapper: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 10,
    },
    tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#E5E5E5',
        gap: 15,
        paddingTop: 20,
        paddingBottom: 18,
    },
    tab: {
        borderWidth: 1,
        borderColor: '#1C4837',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
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
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 18,
        textDecorationLine: 'underline',
    },
    appointmentWrapper: {
        paddingVertical: 20,
        gap: 15,
    },
    floatingButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 5,
    },
});
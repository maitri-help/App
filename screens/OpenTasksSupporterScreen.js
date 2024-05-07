import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import styles from '../Styles';
import Task from '../components/Task';
import { getAccessToken, getUserData } from '../authStorage';
import FilterIcon from '../assets/icons/filter-icon.svg';


export default function OpenTasksSupporterScreen({ navigation }) {

    useEffect(() => {
        async function fetchUserData() {
            try {
                const accessToken = await getAccessToken();
                console.log('Access Token from authStorage:', accessToken);
                if (accessToken) {
                    const userData = await getUserData();
                    setFirstName(userData.firstName);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, []);


    const handleFilter = () => {
        console.log("filter");
    };

    const OpenTasks = [];

    const renderTasks = (tasks) => {
        if (tasks.length === 0) {
                    return (
                        <View style={stylesSuppOT.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesSuppOT.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesSuppOT.tasksEmpty]}>
                                    <View style={stylesSuppOT.tasksTop}>
                                        <Text style={[styles.text, stylesSuppOT.tasksDescription, {marginBottom: 30}]}>
                                            No open tasks yet.
                                        </Text>
                                        <Text style={[styles.text, stylesSuppOT.tasksDescription, {marginBottom: 60, paddingHorizontal: 30}]}>
                                            Check back in later!
                                        </Text>
                                        <Image
                                            source={require('../assets/img/mimi-illustration.png')}
                                            style={stylesSuppOT.rightImageStyle}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
            }

        return (
            <View style={stylesSuppOT.tasksContainer}>
                <ScrollView contentContainerStyle={stylesSuppOT.tasksScroll}>
                    {tasks.map(task => (
                        <Task key={task.id} title={task.title} assignee={task.assignee} time={task.time} emoji={task.emoji} />
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <View style={[styles.topBar, {gap: 0,flexDirection: 'row',borderBottomWidth: 0}]}>
                
                
                <View style={{ gap: 0, flexDirection: 'column', alignItems: 'baseline', borderBottomWidth: 0 }}>
                    <Text style={stylesSuppOT.greetingsText}>Open Tasks</Text>
                    <Text style={stylesSuppOT.thanksText}>Pick a task. Spread the love</Text>
                </View>
                <TouchableOpacity onPress={handleFilter}>
                    <FilterIcon color={"#1c4837"} width={19} height={19}></FilterIcon>
                </TouchableOpacity>
                
            </View>
            <View style={stylesSuppOT.tabsContentContainer}>
                {renderTasks(OpenTasks)}
            </View>
        </SafeAreaView>

    );
}

const stylesSuppOT = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
        lineHeight: 22,
        marginBottom: 5,
    },
    thanksText: {
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
        color: '#737373',
    },
    rightImageStyle: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    tabsContentContainer: {
        flex: 1,
    },
    tasksContainer: {
        flex: 1,
    },
    tasksScroll: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 10,
        paddingBottom: 30,
    },
    tasksScrollEmpty: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 25,
    },
    tasksEmpty: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 150,
    },
    tasks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'poppins-regular',
        lineHeight: 20,
        marginBottom: 10,
    },
    illustration: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
});
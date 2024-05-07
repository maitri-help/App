import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import styles from '../Styles';
import Task from '../components/Task';
import { getAccessToken, getUserData } from '../authStorage';
import { Platform } from 'react-native';


export default function MyTasksSupporterScreen({ navigation }) {

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

    const MyTasks = [
    ];

    const renderTasks = (tasks) => {
        if (tasks.length === 0) {
                    return (
                        <View style={stylesSuppMT.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesSuppMT.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesSuppMT.tasksEmpty]}>
                                    <View style={stylesSuppMT.tasksTop}>
                                        <Text style={[styles.text, stylesSuppMT.tasksDescription, {marginBottom: 30}]}>
                                            Your task list is currently empty.
                                        </Text>
                                        <Text style={[styles.text, stylesSuppMT.tasksDescription, {marginBottom: 60, paddingHorizontal: 30}]}>
                                            Check the open tasks to see where you can lend a hand
                                        </Text>
                                        <Image
                                            source={require('../assets/img/mimi-illustration.png')}
                                            style={stylesSuppMT.rightImageStyle}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
            }

        return (
            <View style={stylesSuppMT.tasksContainer}>
                <ScrollView contentContainerStyle={stylesSuppMT.tasksScroll}>
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
                    <Text style={stylesSuppMT.greetingsText}>My Tasks</Text>
                    <Text style={stylesSuppMT.thanksText}>Your help makes a difference.</Text>
                </View>
            </View>
            <View style={stylesSuppMT.tabsContentContainer}>
                {renderTasks(MyTasks)}
            </View>
        </SafeAreaView>

    );
}

const stylesSuppMT = StyleSheet.create({
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
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
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
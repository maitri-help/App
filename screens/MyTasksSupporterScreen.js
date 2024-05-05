import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import styles from '../Styles';
import Task from '../components/Task';
import { getAccessToken, getUserData } from '../authStorage';
import initalBackground from '../assets/img/welcome-bg.png';
import CloseIcon from '../assets/icons/close-icon.svg';
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
    roundedRectangleContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 10,
        maxWidth: "100%",
    },
    thanksText: {
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
        color: '#737373',
    },
    nameText: {
        fontFamily: 'poppins-bold',
    },
    welcomeText: {
        fontFamily: 'poppins-bold',
        fontSize: 14,
        lineHeight: 18,
        color: '#fff',
        marginBottom: 10,
    },
    infoText: {
        fontFamily: 'poppins-regular',
        fontSize: 14,
        lineHeight: 18,
        color: '#fff',
    },
    rightImageStyle: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    closeIcon: {
        position: 'absolute',
        top: 15,
        right: 20,
    },
    boxesScroll: {
        paddingVertical: 20,
    },
    tabsContentContainer: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginVertical: 10,
    },
    tab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#1C4837',
    },
    tabText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 17,
    },
    activeTabText: {
        color: '#fff',
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
    tasksWelcome: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'poppins-regular',
        marginBottom: 15,
    },
    tasksImgWrapper: {
        alignItems: 'center',
        marginBottom: 15,
    },
    tasksImg: {
        width: 150,
        height: 110,
        resizeMode: 'contain',
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'poppins-regular',
        lineHeight: 20,
        marginBottom: 10,
    },
    tasksArrowImgWrapper: {
        alignItems: 'center',
        marginBottom: 20,
    },
    tasksArrowImg: {
        width: 35,
        height: 90,
        resizeMode: 'contain',
        marginLeft: -120,
    },
    unassignedContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 25,
    },
    illustrationWrapper: {
        alignItems: 'center',
    },
    illustration: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    selectedEmojiItem: {
      width: 60,
      height: 60,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedEmojiText: {
      fontSize: (Platform.OS === 'android') ? 30 : 35,
      textAlign: 'center',
      lineHeight: (Platform.OS === 'android') ? 37 : 42,
    },
});
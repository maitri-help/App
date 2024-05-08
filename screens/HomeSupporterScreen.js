import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import styles from '../Styles';
import Task from '../components/Task';
import { getAccessToken, getUserData } from '../authStorage';
import initalBackground from '../assets/img/welcome-bg.png';
import CloseIcon from '../assets/icons/close-icon.svg';
import { Platform } from 'react-native';


export default function HomeSupporterScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Open');
    const [firstName, setFirstName] = useState('');
    const [greetingText, setGreetingText] = useState('');
    const [isViewActive, setIsViewActive] = useState(true);
    const selectedColor = '#1616';
    const pressedItem = "🦄";
    const [showAllOpenTasks, setShowAllOpenTasks] = useState(false);
    const [showAllMyTasks, setShowAllMyTasks] = useState(false);

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

        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreetingText('Good morning');
        } else if (currentHour < 18) {
            setGreetingText('Good afternoon');
        } else {
            setGreetingText('Good evening');
        }
    }, []);

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const handleClose = () => {
        setIsViewActive(false);
    };

    const OpenTasks = [
        { id: 1, title: 'Call the National Insurance', assignee: 'Just me', time: 'Today, 1:00-2:00 pm', emoji: '🤖' },
        { id: 2, title: 'Take medication', assignee: 'Chandler Bing', time: 'Tomorrow, 10:00-11:00 am', emoji: '🩺' },
        { id: 3, title: 'Buy groceries', assignee: ['Ross Geller', 'Rachel Green'], time: 'Wednesday, 12:00-2:00 pm', emoji: '💞' },
        { id: 4, title: 'Physiotherapy appointment', time: 'Thursday, 8:00-10:00 am', emoji: '🩺' },
        { id: 5, title: 'Remember to write down how I felt today', assignee: 'Just me', time: 'April 5, 5:00-6:00 pm', emoji: '😊' },
    ];

    const MyTasks = [
        { id: 1, title: 'Call the National Insurance', assignee: 'Just me', time: 'Today, 1:00-2:00 pm', emoji: '🤖' },
        { id: 2, title: 'Take medication', assignee: 'Chandler Bing', time: 'Tomorrow, 10:00-11:00 am', emoji: '🩺' },
        { id: 3, title: 'Buy groceries', assignee: ['Ross Geller', 'Rachel Green'], time: 'Wednesday, 12:00-2:00 pm', emoji: '💞' },
        { id: 4, title: 'Physiotherapy appointment', time: 'Thursday, 8:00-10:00 am', emoji: '🩺' },
        { id: 5, title: 'Remember to write down how I felt today', assignee: 'Just me', time: 'April 5, 5:00-6:00 pm', emoji: '😊' },
    ];

    const renderTasks = (tasks, isMyTasks) => {
        let tasksToRender = tasks;
        if (tasks.length === 0) {
            switch (activeTab) {
                case 'Open':
                    return (
                        <View style={stylesSuppHome.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesSuppHome.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesSuppHome.tasksEmpty]}>
                                    <View style={stylesSuppHome.tasksTop}>
                                        <Text style={stylesSuppHome.tasksDescription}>
                                            No open tasks yet.
                                        </Text>
                                        <Text style={stylesSuppHome.tasksDescription}>
                                            Check back in later!
                                        </Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                case 'My':
                    return (
                        <View style={stylesSuppHome.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesSuppHome.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesSuppHome.tasksEmpty]}>
                                    <Text style={stylesSuppHome.tasksDescription}>
                                        Your task list is currently empty.
                                    </Text>
                                    <Text style={stylesSuppHome.tasksDescription}>
                                        Check the open tasks to see where you can lend a hand
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    );
                default:
                    return null;
            }
        } else {
            if (!isMyTasks && !showAllOpenTasks && tasks.length > 3) {
                tasksToRender = tasks.slice(0, 3);
            } else if (isMyTasks && !showAllMyTasks && tasks.length > 4) {
                tasksToRender = tasks.slice(0, 4);
            }
        }

        

        return (
            <View style={stylesSuppHome.tasksContainer}>
            <ScrollView contentContainerStyle={stylesSuppHome.tasksScroll}>
                {tasksToRender.map(task => (
                    <Task key={task.id} title={task.title} assignee={task.assignee} time={task.time} emoji={task.emoji} />
                ))}
                {(!isMyTasks && !showAllOpenTasks && tasks.length > 3) || (isMyTasks && !showAllMyTasks && tasks.length > 4) ? (
                    <TouchableOpacity onPress={() => isMyTasks ? setShowAllMyTasks(true) : setShowAllOpenTasks(true)}>
                        <Text style={stylesSuppHome.seeAllText}>See All</Text>
                    </TouchableOpacity>
                ) : null}
            </ScrollView>
        </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <View style={[styles.topBar, {gap: 0,flexDirection: 'row',borderBottomWidth: 0}]}>
                
                <View style={[
                        stylesSuppHome.selectedEmojiItem, { borderColor: selectedColor }
                    ]}>
                    <Text style={stylesSuppHome.selectedEmojiText}>{pressedItem}</Text>
                </View>
                <View style={{ gap: 0, flexDirection: 'column', alignItems: 'baseline', borderBottomWidth: 0 }}>
                    <Text style={stylesSuppHome.greetingsText}>Hey {firstName}</Text>
                    <Text style={stylesSuppHome.thanksText}>Thanks for being here for <Text style={stylesSuppHome.nameText}>[LEAD full name]!</Text></Text>
                </View>
            </View>
            
            

            {isViewActive && (
                <View style={[styles.contentContainer, { paddingTop: 5, paddingBottom: 15, width: '100%' }]}>
                    <ImageBackground
                        source={initalBackground}
                        style={stylesSuppHome.roundedRectangleContainer}
                    >
                        <TouchableOpacity onPress={handleClose} style={stylesSuppHome.closeIcon}>
                            <CloseIcon width={15} height={15} color={'#000'} />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'left', flexDirection: 'column', flex: 1, paddingRight: 10, }}>
                            <Text style={stylesSuppHome.welcomeText}>Welcome to your home page</Text>
                            <Text style={stylesSuppHome.infoText}>Tasks will show up below</Text>
                        </View>
                        <Image
                            source={require('../assets/img/mimi-flower-illustration.png')}
                            style={stylesSuppHome.rightImageStyle}
                        />
                    </ImageBackground>
                </View>
            )}

            <View style={[stylesSuppHome.tabsContainer, styles.contentContainer]}>
                <TouchableOpacity onPress={() => handleTabPress('Open')} style={[stylesSuppHome.tab, activeTab === 'Open' && stylesSuppHome.activeTab]}>
                    <Text style={[stylesSuppHome.tabText, activeTab === 'Open' && stylesSuppHome.activeTabText]}>Open tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabPress('My')} style={[stylesSuppHome.tab, activeTab === 'My' && stylesSuppHome.activeTab]}>
                    <Text style={[stylesSuppHome.tabText, activeTab === 'My' && stylesSuppHome.activeTabText]}>My tasks</Text>
                </TouchableOpacity>
            </View>
            <View style={stylesSuppHome.tabsContentContainer}>
            {activeTab === 'Open' ? renderTasks(OpenTasks, false) : activeTab === 'My' ? renderTasks(MyTasks, true) : null}
            </View>
        </SafeAreaView>

    );
}

const stylesSuppHome = StyleSheet.create({
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
        marginLeft: 20,
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    closeIcon: {
        position: 'absolute',
        top: 15,
        right: 20,
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
        paddingTop: 120,
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
    seeAllText: {
        fontFamily: 'poppins-regular',
        textAlign: 'center',
        color: '#737373',
        textDecorationLine: 'underline',
    },
});
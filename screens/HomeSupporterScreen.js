import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import styles from '../Styles';
import Task from '../components/Task';
import { getAccessToken, getUserData } from '../authStorage';
import initalBackground from '../assets/img/welcome-bg.png';
import CloseIcon from '../assets/icons/close-icon.svg';


export default function HomeSupporterScreen({ navigation }){
    const [activeTab, setActiveTab] = useState('Open');
    const [firstName, setFirstName] = useState('');
    const [greetingText, setGreetingText] = useState('');
    const [isViewActive, setIsViewActive] = useState(true);


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

    const OpenTasks = [];

    const unassignedTasks = [
        { id: 3, title: 'Physiotherapy appointment', time: 'Thursday, 8:00-10:00 am', emoji: '🩺' },
    ];

    const MyTasks = [ ];

    const renderTasks = (tasks) => {
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
        }

        return (
            <View style={stylesSuppHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesSuppHome.tasksScroll}>
                    {tasks.map(task => (
                        <Task key={task.id} title={task.title} assignee={task.assignee} time={task.time} emoji={task.emoji} />
                    ))}
                </ScrollView>
            </View>
        );
    };

    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, {gap: 0,flexDirection: 'column',alignItems: 'baseline',borderBottomWidth: 0}]}>
                <Text style={stylesSuppHome.greetingsText}>Hey {firstName}!</Text>
                <Text style={stylesSuppHome.textStyle}>Thanks for being here for [LEAD full name]!</Text>
            </View>
            
            {isViewActive && (
                <View style={[styles.contentContainer,{paddingBottom: 10, width: '100%'}]}>
                    <ImageBackground 
                        source={initalBackground} 
                        style={stylesSuppHome.roundedRectangleContainer}
                    >
                        <TouchableOpacity onPress={handleClose} style={stylesSuppHome.closeIcon}>
                            <CloseIcon width={15} height={15} color={'#000'}/>
                        </TouchableOpacity>
                        <View style={[styles.contentContainer, {alignItems: 'left',flexDirection: 'column', width: '49%'}]}>
                            <Text style={[stylesSuppHome.textStyle, {color: 'white', fontFamily: 'poppins-bold'}]}>Welcome to your home page</Text>
                            <Text style={[stylesSuppHome.textStyle, {paddingTop: 10, color: 'white'}]}>Tasks will show up below</Text>
                            
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
                {activeTab === 'Open' ? renderTasks(OpenTasks) : activeTab === 'My' ? renderTasks(MyTasks) : null}
            </View>
        </SafeAreaView>
        
    );
}

const stylesSuppHome = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
    },
    roundedRectangleContainer: {
        borderRadius: 10, 
        overflow: 'hidden',
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 10,
        maxWidth: "100%",
    },
    textStyle: {
        fontFamily: 'poppins-regular',
        fontSize: 13,
    },
    rightImageStyle: {
        marginLeft: 20,
        width: 120, 
        height: 120, 
        resizeMode: 'contain', 
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        left: 310,
    },
    boxesScroll: {
        paddingVertical: 20,
    },
    tabsContentContainer: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
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
});
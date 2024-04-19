import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import styles from '../Styles';
import BellIcon from '../assets/icons/bell-icon.svg';
import CustomBox from '../components/CustomBox';
import Task from '../components/Task';
import { getAccessToken, getUserData } from '../authStorage';

export default function HomeScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('All');
    const [firstName, setFirstName] = useState('');
    const [greetingText, setGreetingText] = useState('');

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

    const allTasks = [
        { id: 1, title: 'Call the National Insurance', assignee: 'Just me', time: 'Today, 1:00-2:00 pm', image: require('../assets/emojis/robot-icon.png') },
        { id: 2, title: 'Take medication', assignee: 'Chandler Bing', time: 'Tomorrow, 10:00-11:00 am', image: require('../assets/emojis/doctor-icon.png') },
        { id: 3, title: 'Buy groceries', assignee: ['Ross Geller', 'Rachel Green'], time: 'Wednesday, 12:00-2:00 pm', image: require('../assets/emojis/hearts-icon.png') },
        { id: 4, title: 'Physiotherapy appointment', time: 'Thursday, 8:00-10:00 am', image: require('../assets/emojis/doctor-icon.png') },
        { id: 5, title: 'Remember to write down how I felt today', assignee: 'Just me', time: 'April 5, 5:00-6:00 pm', image: require('../assets/emojis/smiling-face-icon.png') },
    ];

    const unassignedTasks = [
        { id: 3, title: 'Physiotherapy appointment', time: 'Thursday, 8:00-10:00 am', image: require('../assets/emojis/doctor-icon.png') },
    ];

    const personalTasks = [
        { id: 1, title: 'Call the National Insurance', assignee: 'Just me', time: 'Today, 1:00-2:00 pm', image: require('../assets/emojis/robot-icon.png') },
        { id: 4, title: 'Remember to write down how I felt today', assignee: 'Just me', time: 'April 5, 5:00-6:00 pm', image: require('../assets/emojis/smiling-face-icon.png') },
    ];

    const renderTasks = (tasks) => {
        if (tasks.length === 0) {
            switch (activeTab) {
                case 'All':
                    return (
                        <View style={stylesHome.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesHome.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesHome.tasksEmpty]}>
                                    <View style={stylesHome.tasksTop}>
                                        <Text style={stylesHome.tasksWelcome}>
                                            Welcome to Maitri!
                                        </Text>
                                        <View style={stylesHome.tasksImgWrapper}>
                                            <Image source={require('../assets/img/tasks-placeholder.png')} style={stylesHome.tasksImg} />
                                        </View>
                                    </View>
                                    <View style={stylesHome.tasksBottom}>
                                        <Text style={stylesHome.tasksDescription}>
                                            Click here To add your first task
                                        </Text>
                                        <View style={stylesHome.tasksArrowImgWrapper}>
                                            <Image source={require('../assets/img/purple-arrow-down.png')} style={stylesHome.tasksArrowImg} />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                case 'Unassigned':
                    return (
                        <View style={stylesHome.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesHome.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesHome.tasksEmpty]}>
                                    <View style={stylesHome.unassignedContainer}>
                                        <View style={stylesHome.textWrapper}>
                                            <Text style={[styles.text, stylesHome.text]}>
                                                All tasks have been assigned
                                            </Text>
                                        </View>
                                        <View style={stylesHome.illustrationWrapper}>
                                            <Image source={require('../assets/img/mimi-illustration.png')} style={stylesHome.illustration} />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                case 'Personal':
                    return (
                        <View style={stylesHome.tasksContainer}>
                            <ScrollView contentContainerStyle={stylesHome.tasksScrollEmpty}>
                                <View style={[styles.contentContainer, stylesHome.tasksEmpty]}>
                                    <View style={stylesHome.tasksPersonalTop}>
                                        <Text style={[styles.text, stylesHome.text]}>
                                            You have no personal tasks yet
                                        </Text>
                                    </View>
                                    <View style={stylesHome.tasksBottom}>
                                        <Text style={stylesHome.tasksDescription}>
                                            Click here To add your first task
                                        </Text>
                                        <View style={stylesHome.tasksArrowImgWrapper}>
                                            <Image source={require('../assets/img/purple-arrow-down.png')} style={stylesHome.tasksArrowImg} />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                default:
                    return null;
            }
        }

        return (
            <View style={stylesHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesHome.tasksScroll}>
                    {tasks.map(task => (
                        <Task key={task.id} title={task.title} assignee={task.assignee} time={task.time} image={task.image} />
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <Text style={stylesHome.greetingsText}>{greetingText} {firstName}!</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={stylesHome.bellWrapper}>
                    <BellIcon style={stylesHome.bellIcon} />
                    <View style={stylesHome.indicator}></View>
                </TouchableOpacity>
            </View>
            <View style={stylesHome.boxesContainer}>
                <ScrollView horizontal={true} style={stylesHome.boxesScroll}>
                    <View style={{ marginLeft: 15 }} />
                    <CustomBox
                        title="Rachel Green"
                        subtitle="Has completed"
                        largerText="Do the Laundry"
                        buttons={[{ title: 'Say thank you!', bgColor: '#fff', textColor: '#000' }]}
                        bgColor="#FFE8D7"
                        bgImgColor="#FFD8BC"
                    />
                    <CustomBox
                        title="You haven't approved"
                        largerText="Phoebe Buffay"
                        secondSubtitle="For a long time"
                        buttons={[
                            { title: 'Confirm', bgColor: '#D4EED0', textColor: '#000' },
                            { title: 'Decline', bgColor: '#fff', textColor: '#000' }
                        ]}
                        bgColor="#E1D0FD"
                        bgImg={3}
                        bgImgColor="#EDE3FE"
                    />
                    <CustomBox
                        title="Nothing to do?"
                        buttons={[{ title: 'Add a new task' }]}
                        bgColor="#E5F5E3"
                        bgImgColor="#D6EFD2"
                        bgImg={4}
                    />
                    <CustomBox
                        title="[Advice here, up to 6 short lines from the “quotes and advice” doc]"
                        bgColor="#D4E6E5"
                        bgImgColor="#B7D6D3"
                    />
                    <CustomBox
                        title="Come add family & friends to your circles"
                        buttons={[{ title: 'Add a new person', bgColor: '#fff', textColor: '#000' }]}
                        bgColor="#FFE8D7"
                        bgImgColor="#FFD8BC"
                        bgImg={2}
                    />
                    <View style={{ marginRight: 15 }} />
                </ScrollView>
            </View>

            <View style={[stylesHome.tabsContainer, styles.contentContainer]}>
                <TouchableOpacity onPress={() => handleTabPress('All')} style={[stylesHome.tab, activeTab === 'All' && stylesHome.activeTab]}>
                    <Text style={[stylesHome.tabText, activeTab === 'All' && stylesHome.activeTabText]}>All tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabPress('Unassigned')} style={[stylesHome.tab, activeTab === 'Unassigned' && stylesHome.activeTab]}>
                    <Text style={[stylesHome.tabText, activeTab === 'Unassigned' && stylesHome.activeTabText]}>Unassigned</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTabPress('Personal')} style={[stylesHome.tab, activeTab === 'Personal' && stylesHome.activeTab]}>
                    <Text style={[stylesHome.tabText, activeTab === 'Personal' && stylesHome.activeTabText]}>Personal</Text>
                </TouchableOpacity>
            </View>

            <View style={stylesHome.tabsContentContainer}>
                {activeTab === 'All' ? renderTasks(allTasks) : activeTab === 'Unassigned' ? renderTasks(unassignedTasks) : activeTab === 'Personal' ? renderTasks(personalTasks) : null}
            </View>
        </SafeAreaView>
    );
}

const stylesHome = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
    },
    bellWrapper: {
        position: 'relative',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -5,
        marginVertical: -5,
    },
    bellIcon: {
        width: 20,
        height: 20,
        color: '#000',
    },
    indicator: {
        backgroundColor: '#E91145',
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        bottom: 4,
        right: 1,
    },
    boxesScroll: {
        paddingVertical: 20,
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
        justifyContent: 'flex-end',
    },
    tasks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    tasksWelcome: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'poppins-bold',
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
        fontFamily: 'poppins-medium',
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
    text: {
        textAlign: 'center',
    },
    tasksPersonalTop: {
        justifyContent: 'center',
        flex: 1,
    }
});
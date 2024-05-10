import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import styles from '../Styles';
import Task from '../components/Task';
import TaskClickable from '../components/TaskClickable';
import TaskItem from '../components/TaskItem';
import { checkAuthentication } from '../authStorage';
import FilterIcon from '../assets/icons/filter-icon.svg';
import EditForm from '../components/plusModalSteps/EditForm';
import EditFormNoCircle from '../components/plusModalSteps/EditFormNoCircle';

export default function OpenTasksSupporterScreen({ navigation }) {
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleTaskClick = (task) => {
        console.log('Task clicked:', task); // This will log the clicked task
        setSelectedTask(task);
        setIsEditFormOpen(true);
      };
    
      const handleClose = () => {
        setIsEditFormOpen(false);
      };

      useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication(); 
                if (userData) {
                    console.log('User data:', userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.navigate('Login');
            }
        }
        fetchUserData();
    }, []);

    // FilterOnPress
    const handleFilter = () => {
        console.log("filter");
    };

    const OpenTasks = [
        { id: 1, title: 'Call the National Insurance', assignee: 'Just me', time: '2024-05-08T20:55:00.000Z', emoji: '🤖', location: "47.47480786890561,19.176439097637857", description: "Call desc" },
        { id: 2, title: 'Take medication', assignee: 'Chandler Bing', time: '2024-05-08T20:55:00.000Z', emoji: '🩺', location: "47.47480786890561,19.176439097637857", description: "Med desc"  },
        { id: 3, title: 'Buy groceries', assignee: ['Ross Geller', 'Rachel Green'], time: '2024-05-08T20:55:00.000Z', emoji: '💞', location: "47.47480786890561,19.176439097637857", description: "Buy desc"  },
        { id: 4, title: 'Physiotherapy appointment', time: '2024-05-08T20:55:00.000Z', emoji: '🩺', location: "47.47480786890561,19.176439097637857", description: "Phys desc"  },
        { id: 5, title: 'Remember to write down how I felt today', assignee: 'Just me', time: '2024-05-08T20:55:00.000Z', emoji: '😊', location: "47.47480786890561,19.176439097637857", description: "Remember desc"  },
    ];

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
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => handleTaskClick(task)} // Log when task is clicked
            >
              <TaskClickable
                key={task.id} 
                title={task.title} 
                assignee={task.assignee} 
                time={task.time} 
                emoji={task.emoji} 
                onTaskClick={() => handleTaskClick(task)}
              />
            </TouchableOpacity>
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

            {isEditFormOpen && 
                <EditFormNoCircle
                    taskName={selectedTask.title} 
                    description={selectedTask.description} 
                    selectedLocation={selectedTask.location}
                    time={selectedTask.time}
                    // pass other task properties as needed
                    onClose={() => setIsEditFormOpen(false)} 
                />
            }

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
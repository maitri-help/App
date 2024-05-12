import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ImageBackground, Animated} from 'react-native';
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

    const overlayOpacity = useRef(new Animated.Value(0)).current;

    function formatTime(time) {
        if (time) {
            const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
            const formattedTime = new Date(time).toLocaleString('en-US', options);
            return formattedTime;
        }
        return time;
    }

    useEffect(() => {
        if (isEditFormOpen) {
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
      }, [{isEditFormOpen}]);

    const handleTaskClick = (task) => {
        console.log('Task clicked:', task);
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

    var OpenTasks = [
        { id: 1, title: 'Buy groceries', time: '2024-05-12T15:00:00.000Z', emoji: '🛒', location: "47.47480786890561,19.176439097637857", description: "Milk, eggs, bread, and fruits", assignee: "Alice", note: "Don't forget to check for any ongoing discounts at the store.Don't forget to check for any ongoing discounts at the store.Don't forget to check for any ongoing discounts at the store.Don't forget to check for any ongoing discounts at the store.ck for any ongoing discounts at the store.ck for any ongoing discounts at the store.ck for any ongoing discounts at the store.ck for any ongoing discounts at the store.ck for any ongoing discounts at the store." },
        { id: 3, title: 'Workout session', time: '2024-05-13T18:00:00.000Z', emoji: '💪', location: "47.4925, 19.0513", description: "Cardio and strength training", assignee: "Charlie", note: "Remember to hydrate well before and after the workout." },
        { id: 4, title: 'Read book', time: '2024-05-12T20:00:00.000Z', emoji: '📖', location: "47.4979, 19.0402", description: "Chapter 5-8 of 'Sapiens' by Yuval Noah Harari", assignee: "David", note: "Find a quiet spot to fully immerse yourself in the reading." },
        { id: 5, title: 'Write report', time: '2024-05-15T12:00:00.000Z', emoji: '📝', location: "47.4818, 19.0790", description: "Data analysis findings", assignee: "Emma", note: "Organize your findings logically before starting to write." },
        { id: 6, title: 'Call mom', time: '2024-05-12T17:30:00.000Z', emoji: '📞', location: "47.4940, 19.0488", description: "Discuss weekend plans", assignee: "Frank", note: "Ask about her recent doctor's appointment." },
        { id: 7, title: 'Pay bills', time: '2024-05-14T11:00:00.000Z', emoji: '💸', location: "47.4893, 19.0650", description: "Electricity, water, and internet bills", assignee: "Grace", note: "Make sure all bills are paid before their due dates." },
        { id: 8, title: 'Visit dentist', time: '2024-05-17T14:45:00.000Z', emoji: '😬', location: "47.4966, 19.0521", description: "Biannual check-up and cleaning", assignee: "Hannah", note: "Arrive 15 minutes early for the appointment." },
        { id: 2, title: 'Attend meeting', time: '2024-05-14T09:30:00.000Z', emoji: '📅', location: "47.512174, 19.058934", description: "Discuss project updates", assignee: "Bob", note: "Prepare " },
        
    ];
      
    // Ha mindenképp jon a task-al assignee, eltávolítjuk az assignee-t.
    const removeAssigneeAttribute = (tasks) => {
        return tasks.map(task => {
            const { assignee, ...rest } = task;
            return rest;
        });
    };
    OpenTasks = removeAssigneeAttribute(OpenTasks);

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
                    onPress={() => handleTaskClick(task)}
                    >
                        <TaskClickable
                            key={task.id} 
                            title={task.title} 
                            assignee={task.assignee} 
                            time={formatTime(task.time)} 
                            emoji={task.emoji} 
                            onTaskClick={() => handleTaskClick(task)}
                        />
                    </TouchableOpacity>
                ))}
                </ScrollView>

                {isEditFormOpen && 
                    <EditFormNoCircle 
                        taskName={selectedTask.title} 
                        description={selectedTask.description} 
                        selectedLocation={selectedTask.location}
                        time={selectedTask.time}
                        onClose={handleClose} 
                        notes={selectedTask.note}
                    />
                }
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
            
            {(isEditFormOpen) && (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity}]} />  // Add zIndex: 0 here
)}
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
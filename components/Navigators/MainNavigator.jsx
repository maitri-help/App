import React from 'react';
import HomeIcon from '../../assets/icons/home-icon.svg';
import AssignmentsCheckIcon from '../../assets/icons/assignments-check-icon.svg';
import CirclesIcon from '../../assets/icons/circles-icon.svg';
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import HomeScreen from '../../screens/HomeScreen';
import AssignmentsScreen from '../../screens/AssignmentsScreen';
import CirclesScreen from '../../screens/CirclesScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    if (route.name === 'Home') {
                        return (
                            <HomeIcon color={color} width={19} height={19} />
                        );
                    } else if (route.name === 'Assignments') {
                        return (
                            <AssignmentsCheckIcon
                                color={color}
                                width={19}
                                height={19}
                            />
                        );
                    } else if (route.name === 'Circles') {
                        return (
                            <CirclesIcon color={color} width={21} height={21} />
                        );
                    } else if (route.name === 'Profile') {
                        return (
                            <ProfileIcon color={color} width={19} height={19} />
                        );
                    }
                },
                tabBarActiveTintColor: '#1C4837',
                tabBarInactiveTintColor: '#C7C7C7',
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#F5F5F5'
                },
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Assignments" component={AssignmentsScreen} />
            <Tab.Screen name="Circles" component={CirclesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default MainNavigator;

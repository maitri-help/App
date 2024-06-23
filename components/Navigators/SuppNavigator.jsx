import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeIcon from '../../assets/icons/home-icon.svg';
import ProfileIcon from '../../assets/icons/profile-icon.svg';
import HomeSupporterScreen from '../../screens/HomeSupporterScreen';
import OpenIcon from '../../assets/icons/open-icon.svg';
import MyTasksSupporterScreen from '../../screens/MyTasksSupporterScreen';
import OpenTasksSupporterScreen from '../../screens/OpenTasksSupporterScreen';
import ProfileSupporterScreen from '../../screens/ProfileSupporterScreen';
import AssignmentsCheckIcon from '../../assets/icons/assignments-check-icon.svg';

const Tab = createBottomTabNavigator();

function SuppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    if (route.name === 'Home') {
                        return (
                            <HomeIcon color={color} width={19} height={19} />
                        );
                    } else if (route.name === 'MyTasks') {
                        return (
                            <AssignmentsCheckIcon
                                color={color}
                                width={19}
                                height={19}
                            />
                        );
                    } else if (route.name === 'OpenTasks') {
                        return (
                            <OpenIcon color={color} width={21} height={21} />
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
            <Tab.Screen name="Home" component={HomeSupporterScreen} />
            <Tab.Screen name="MyTasks" component={MyTasksSupporterScreen} />
            <Tab.Screen name="OpenTasks" component={OpenTasksSupporterScreen} />
            <Tab.Screen name="Profile" component={ProfileSupporterScreen} />
        </Tab.Navigator>
    );
}

export default SuppNavigator;

import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './hooks/useFonts';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeIcon from './assets/icons/home-icon.svg';
import AssignmentsCheckIcon from './assets/icons/assignments-check-icon.svg';
import HomeScreen from './screens/HomeScreen';
import AssignmentsScreen from './screens/AssignmentsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import styles from './Styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          if (route.name === 'Home') {
            return <HomeIcon color={color} width={18} height={18} />;
          } else if (route.name === 'Assignments') {
            return <AssignmentsCheckIcon color={color} width={18} height={18} />;
          }
        },
        tabBarActiveTintColor: '#1C4837',
        tabBarInactiveTintColor: '#C7C7C7',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#F5F5F5',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Assignments" component={AssignmentsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadAppResources() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await useFonts();
        await SplashScreen.hideAsync();
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }
    loadAppResources();
  }, []);

  if (!isReady) {
    return <Image source={require('./assets/splash.png')} style={styles.splashImg} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnboardingScreen" screenOptions={() => ({
        headerShown: false,
      })}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

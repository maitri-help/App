import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './hooks/useFonts';
import { Image, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeIcon from './assets/icons/home-icon.svg';
import AssignmentsCheckIcon from './assets/icons/assignments-check-icon.svg';
import CirclesIcon from './assets/icons/circles-icon.svg';
import ProfileIcon from './assets/icons/profile-icon.svg';
import HomeScreen from './screens/HomeScreen';
import AssignmentsScreen from './screens/AssignmentsScreen';
import CirclesScreen from './screens/CirclesScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VerifyNumberScreen from './screens/VerifyNumberScreen';
import AlmostThereScreen from './screens/AlmostThereScreen';
import SuccessScreen from './screens/SuccessScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import IdentifyScreen from './screens/IdentifyScreen';
import styles from './Styles';
import { ToastProvider } from 'react-native-toast-notifications';
import * as Linking from 'expo-linking';
import { clearUserData } from './authStorage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainNavigator({ setIsLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          if (route.name === 'Home') {
            return <HomeIcon color={color} width={19} height={19} />;
          } else if (route.name === 'Assignments') {
            return <AssignmentsCheckIcon color={color} width={19} height={19} />;
          } else if (route.name === 'Circles') {
            return <CirclesIcon color={color} width={21} height={21} />;
          } else if (route.name === 'Profile') {
            return <ProfileIcon color={color} width={19} height={19} />;
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
      <Tab.Screen name="Circles" component={CirclesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    Linking.addEventListener('url', handleAppReload);

    return () => {
      Linking.removeEventListener('url', handleAppReload);
    };
  }, []);

  // Function to handle app reload
  const handleAppReload = async (event) => {
    const url = event.url || '';
    if (url.includes('exp://192.168.100.3:8081/--/')) {
      await clearUserData();
    }
  };

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
    <ToastProvider
      placement="top"
      offsetTop={30}
      renderType={{
        error: (toast) => (
          <View style={[styles.toast, styles.toastError]}>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        ),
        success: (toast) => (
          <View style={[styles.toast, styles.toastSuccess]}>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        )
      }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="OnboardingScreen" screenOptions={() => ({
          headerShown: false,
        })}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main" options={{ gestureEnabled: false }}>
            {() => <MainNavigator setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: !isLoggedIn }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ gestureEnabled: !isLoggedIn }} />
          <Stack.Screen name="VerifyNumber" component={VerifyNumberScreen} options={{ gestureEnabled: !isLoggedIn }} />
          <Stack.Screen name="AlmostThere" component={AlmostThereScreen} options={{ gestureEnabled: !isLoggedIn }} />
          <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: !isLoggedIn }} />
          <Stack.Screen name="Identify" component={IdentifyScreen} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

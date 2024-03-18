import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './hooks/useFonts';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeIcon from './assets/icons/home-icon.svg';
import AssignmentsCheckIcon from './assets/icons/assignments-check-icon.svg';
import AppButton from './compontents/Button';

import ExpandableCalendarScreen from './compontents/Calendar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  title: {
    color: '#1C4837',
    fontSize: 25,
    fontWeight: '700',
    fontFamily: 'poppins-bold',
  },
  calendarContainer: {
    paddingTop: 80,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appButtonText: {
    fontFamily: 'poppins-medium',
  },
});

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assignment Monthly</Text>
      <View style={styles.buttonContainer}>
        <AppButton
          onPress={() => navigation.navigate('Assignments')}
          title="See assignments"
          textStyle={styles.appButtonText}
        />
      </View>
    </View>
  );
}

function AssignmentsScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <ExpandableCalendarScreen />
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  const [IsReady, SetIsReady] = useState(false);

  useEffect(() => {
    async function loadAppResources() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await useFonts();
        await SplashScreen.hideAsync();
        SetIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }
    loadAppResources();
  }, []);

  if (!IsReady) {
    return null;
  }

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
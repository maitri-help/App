import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './hooks/useFonts';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeIcon from './assets/icons/home-icon.svg';
import AssignmentsCheckIcon from './assets/icons/assignments-check-icon.svg';
import HomeScreen from './screens/HomeScreen';
import AssignmentsScreen from './screens/AssignmentsScreen';
import Swiper from 'react-native-swiper';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AppButton from './compontents/Button';
import styles from './Styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Onboarding({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const onSkip = () => {
    setCurrentStep(onboardingData.length - 1);
  };

  const onboardingData = [
    {
      image: require('./assets/img/onboarding-welcome.png'),
      title: 'Welcome to Maitri',
      text: 'A new way to ask for help.',
    },
    {
      image: require('./assets/img/onboarding-build-tribe.png'),
      title: 'Build your tribe',
      text: 'Engage your community and create a support network you can lean on.',
    },
    {
      image: require('./assets/img/onboarding-share-load.png'),
      title: 'Share the load',
      text: 'Set up tasks to make any situation of need easier and more manageable.',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        loop={false}
        index={currentStep}
        onIndexChanged={(index) => setCurrentStep(index)}
        showsButtons={false}
        showsPagination={false}
      >
        {onboardingData.map((step, index) => (
          <View key={index} style={styles.container}>
            <Image source={step.image} style={stylesOnboard.onboardingImg} />
            <View style={stylesOnboard.onboardingTextContainer}>
              <Text style={stylesOnboard.title}>{step.title}</Text>
              <Text style={stylesOnboard.text}>{step.text}</Text>
            </View>
            {index < onboardingData.length - 1 && (
              <TouchableOpacity onPress={onSkip} style={stylesOnboard.skipButton}>
                <Text>Skip</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Swiper>
      {currentStep === onboardingData.length - 1 && (
        <View style={stylesOnboard.onboardingButtonsContainer}>
          <View style={styles.buttonContainer}>
            <AppButton
              onPress={() => navigation.navigate('Login')}
              title="Create Account"
              buttonStyle={stylesOnboard.buttonStyle}
            />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={stylesOnboard.haveAccountText}>Already have an account? <Text style={stylesOnboard.loginText}>Log in</Text></Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={stylesOnboard.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[stylesOnboard.dot, index === currentStep && stylesOnboard.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

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
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={() => ({
        headerShown: false,
      })}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const stylesOnboard = StyleSheet.create({
  onboardingImg: {
    resizeMode: 'contain',
    width: 350,
    height: 230,
    marginTop: -120,
  },
  dotsContainer: {
    width: '100%',
    position: 'absolute',
    bottom: '27%',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#A3A3A3',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 20,
  },
  onboardingTextContainer: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    fontFamily: 'poppins-medium',
  },
  text: {
    textAlign: 'center',
    color: '#7A7A7A',
    fontSize: 14,
  },
  skipButton: {
    position: 'absolute',
    top: 70,
    right: 30,
  },
  onboardingButtonsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    width: '100%',
    alignItems: 'center',
    gap: 30,
  },
  buttonStyle: {
    width: '100%',
  },
  haveAccountText: {
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  loginText: {
    fontWeight: 600,
    fontFamily: 'poppins-semibold',
  }
});

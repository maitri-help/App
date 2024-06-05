import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useFonts from './hooks/useFonts';
import { Image, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import styles from './Styles';
import { ToastProvider } from 'react-native-toast-notifications';
import { checkAuthentication, getOnboardingCompleted } from './authStorage';
import { useToast } from 'react-native-toast-notifications';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { ONESIGNAL_APP_ID } from '@env';
import StackNavigator from './components/Navigators/StackNavigator';

export default function App() {
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [userData, setUserData] = useState(null);
    const toast = useToast();

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

    useEffect(() => {
        const checkAuthAndOnboarding = async () => {
            try {
                const userData = await checkAuthentication();
                setUserData(userData);
                setIsLoggedIn(userData !== null);

                const completedOnboarding = await getOnboardingCompleted();
                setHasCompletedOnboarding(completedOnboarding);

                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast.show('Authentication failed. Please login again.', {
                        type: 'error'
                    });
                } else {
                    console.error('Error checking authentication:', error);
                }
                setLoading(false);
            }
        };

        checkAuthAndOnboarding();
    }, []);

    useEffect(() => {
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.initialize('1b855f1e-0e05-450c-99e8-34e4d6f7f642');
        OneSignal.Notifications.requestPermission(true);
        if (isLoggedIn) {
            OneSignal.login(`${userData.userId}`); // OneSignal requires a string
        }
    }, [isLoggedIn]);

    if (!isReady || loading) {
        return (
            <Image
                source={require('./assets/splash.png')}
                style={styles.splashImg}
            />
        );
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
                <StackNavigator
                    isLoggedIn={isLoggedIn}
                    hasCompletedOnboarding={hasCompletedOnboarding}
                    userData={userData}
                />
            </NavigationContainer>
        </ToastProvider>
    );
}

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NotificationsScreen from '../../screens/NotificationsScreen';
import PendingRequestScreen from '../../screens/PendingRequestScreen';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import VerifyNumberScreen from '../../screens/VerifyNumberScreen';
import AlmostThereScreen from '../../screens/AlmostThereScreen';
import SuccessScreen from '../../screens/SuccessScreen';
import OnboardingScreen from '../../screens/OnboardingScreen';
import IdentifyScreen from '../../screens/IdentifyScreen';
import SuppGreatNewsScreen from '../../screens/SuppGreatNewsScreen';
import SuppIDScreen from '../../screens/SuppIDScreen';
import SuppNavigator from './SuppNavigator';
import LeadNavigator from './LeadNavigator';
import { useUser } from '../../context/UserContext';
import ManageLocationsScreen from '../../screens/ManageLocationsScreen';
import LimitReachedScreen from '../../screens/LimitReachedScreen';
import GetMoreScreen from '../../screens/GetMoreScreen';
import ChatScreen from '../../screens/ChatScreen';

const Stack = createStackNavigator();
const MainNavigator = () => {
    const { userData, isLoggedIn, hasCompletedOnboarding } = useUser();
    return (
        <>
            <Stack.Navigator
                initialRouteName={
                    !isLoggedIn
                    ? hasCompletedOnboarding
                        ? 'Login'
                        : 'Onboarding'
                    : userData && userData.userType === 'Supporter'
                    ? 'MainSupporter'
                    : userData && userData.userType === 'default'
                    ? 'Identify'
                    : 'Main'
                }
                screenOptions={{ headerShown: false }}
            >
                {!isLoggedIn || !hasCompletedOnboarding ? (
                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingScreen}
                        options={{ gestureEnabled: false }}
                    />
                ) : null}
                <Stack.Screen
                    name="Main"
                    component={LeadNavigator}
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                    name="MainSupporter"
                    component={SuppNavigator}
                    options={{ gestureEnabled: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                <Stack.Screen
                    name="LimitReached"
                    component={LimitReachedScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                <Stack.Screen
                    name="GetMore"
                    component={GetMoreScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                <Stack.Screen
                    name="VerifyNumber"
                    component={VerifyNumberScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                <Stack.Screen
                    name="AlmostThere"
                    component={AlmostThereScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                <Stack.Screen
                    name="Success"
                    component={SuccessScreen}
                    options={{ gestureEnabled: !isLoggedIn }}
                />
                    <Stack.Screen
                    name="Identify"
                    component={IdentifyScreen}
                    initialParams={{ userId: userData?.userId }}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                />
                <Stack.Screen
                    name="PendingRequest"
                    component={PendingRequestScreen}
                />
                <Stack.Screen
                    name="SuppGreatNews"
                    component={SuppGreatNewsScreen}
                />
                <Stack.Screen name="SuppID" component={SuppIDScreen} />
                <Stack.Screen name="ManageLocations" component={ManageLocationsScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </>
    );
};

export default MainNavigator;

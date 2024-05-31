import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from './constants/config';

const baseUrl = API_URL;
// const baseUrl = 'http://localhost:3000';

export const storeUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
        console.error('Error storing user data:', error);
    }
};

export const getUserData = async () => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
            const userData = JSON.parse(userDataString);

            return userData;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
};

export const clearUserData = async () => {
    try {
        await AsyncStorage.removeItem('userData');
        await clearAccessToken();
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
};

export const setOnboardingCompleted = async (isCompleted) => {
    try {
        await AsyncStorage.setItem(
            'onboardingCompleted',
            JSON.stringify(isCompleted)
        );
    } catch (error) {
        console.error('Error storing onboarding completion status:', error);
    }
};

export const getOnboardingCompleted = async () => {
    try {
        const onboardingCompletedString = await AsyncStorage.getItem(
            'onboardingCompleted'
        );
        if (onboardingCompletedString !== null) {
            const isCompleted = JSON.parse(onboardingCompletedString);

            return isCompleted;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error retrieving onboarding completion status:', error);
        return false;
    }
};

export const clearOnboardingCompleted = async () => {
    try {
        await AsyncStorage.removeItem('onboardingCompleted');
    } catch (error) {
        console.error('Error clearing onboarding completion status:', error);
    }
};

export const storeAccessToken = async (accessToken) => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
        console.error('Error storing access token:', error);
    }
};

export const getAccessToken = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken !== null) {
            return accessToken;
        } else {
            console.log('No access token found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
};

export const clearAccessToken = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Error clearing access token:', error);
    }
};

export const updateUserTypeInStorage = async (userType) => {
    try {
        const userData = await getUserData();
        if (userData) {
            const updatedUserData = { ...userData, userType };
            await storeUserData(updatedUserData);
        } else {
            console.log('No user data found');
        }
    } catch (error) {
        console.error('Error updating user type in storage:', error);
    }
};

export const checkAuthentication = async () => {
    try {
        const accessToken = await getAccessToken();
        if (accessToken) {
            console.log("CHECK AUTH", accessToken)
            const response = await axios.get(`${baseUrl}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("RESPONSE", response)
            const userData = response.data;
            userData.accessToken = accessToken;
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await clearUserData();
            await clearAccessToken();
            console.error('Authentication failed. Please login again.', error);
        } else {
            await clearUserData();
            await clearAccessToken();
            console.error('Error checking authentication:', error);
        }
        return null;
    }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseUrl = 'http://52.19.91.67:3000';

export const storeUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data stored successfully:', userData);
    } catch (error) {
        console.error('Error storing user data:', error);
    }
};

export const getUserData = async () => {
    try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString !== null) {
            const userData = JSON.parse(userDataString);
            console.log('User data retrieved successfully:', userData);
            return userData;
        } else {
            console.log('No user data found');
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
        console.log('User data cleared successfully');
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
};

export const setOnboardingCompleted = async (isCompleted) => {
    try {
        await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(isCompleted));
        console.log('Onboarding completion status stored successfully');
    } catch (error) {
        console.error('Error storing onboarding completion status:', error);
    }
};

export const getOnboardingCompleted = async () => {
    try {
        const onboardingCompletedString = await AsyncStorage.getItem('onboardingCompleted');
        if (onboardingCompletedString !== null) {
            const isCompleted = JSON.parse(onboardingCompletedString);
            console.log('Onboarding completion status retrieved successfully:', isCompleted);
            return isCompleted;
        } else {
            console.log('No onboarding completion status found');
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
        console.log('Onboarding completion status cleared successfully');
    } catch (error) {
        console.error('Error clearing onboarding completion status:', error);
    }
};

export const storeAccessToken = async (accessToken) => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
        console.log('Access token stored successfully');
    } catch (error) {
        console.error('Error storing access token:', error);
    }
};

export const getAccessToken = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken !== null) {
            console.log('Access token retrieved successfully:', accessToken);
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
        console.log('Access token cleared successfully');
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
            console.log('User type updated successfully:', userType);
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
            const response = await axios.get(`${baseUrl}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const userData = response.data;
            userData.accessToken = accessToken;
            console.log('Authentication response:', userData);
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
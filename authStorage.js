import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data stored successfully');
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
        console.log('User data cleared successfully');
    } catch (error) {
        console.error('Error clearing user data:', error);
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
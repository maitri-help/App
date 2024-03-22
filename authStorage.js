import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAccessToken = async (accessToken) => {
    try {
        await AsyncStorage.setItem('accessToken', accessToken);
        console.log('AccessToken stored successfully');
    } catch (error) {
        console.error('Error storing accessToken:', error);
    }
};

export const getAccessToken = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken !== null) {
            console.log('AccessToken retrieved successfully:', accessToken);
            return accessToken;
        } else {
            console.log('No accessToken found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving accessToken:', error);
        return null;
    }
};

export const clearAccessToken = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
        console.log('AccessToken cleared successfully');
    } catch (error) {
        console.error('Error clearing accessToken:', error);
    }
};
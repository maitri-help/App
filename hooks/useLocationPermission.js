import { useState, useEffect, useRef } from 'react';
import { AppState, Linking } from 'react-native';
import * as Location from 'expo-location';

const useLocationPermission = () => {
    const [locationPermissionNeeded, setLocationPermissionNeeded] =
        useState(false);
    const [deviceLocation, setDeviceLocation] = useState(null);
    const appState = useRef(AppState.currentState);

    const requestLocation = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted && !permission.canAskAgain) {
            setLocationPermissionNeeded(true);
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setDeviceLocation(
            `${location.coords.latitude},${location.coords.longitude}`
        );
    };

    useEffect(() => {
        requestLocation();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    requestLocation();
                }
                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    const handleGoToSettings = () => {
        Linking.openSettings();
        setLocationPermissionNeeded(false);
    };

    return {
        locationPermissionNeeded,
        deviceLocation,
        handleGoToSettings
    };
};

export default useLocationPermission;

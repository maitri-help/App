import { LocationContext } from '../context/LocationContext';
import useLocationPermission from '../hooks/useLocationPermission';

export const LocationProvider = ({ children }) => {
    const { locationPermissionNeeded, deviceLocation, handleGoToSettings } =
        useLocationPermission();

    return (
        <LocationContext.Provider
            value={{
                locationPermissionNeeded,
                deviceLocation,
                handleGoToSettings
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

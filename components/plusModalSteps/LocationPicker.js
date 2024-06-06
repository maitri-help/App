import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import CloseIcon from '../../assets/icons/close-icon.svg';
import { GEOLOCATION_API_KEY } from '../../constants/config';
import { useLocation } from '../../context/LocationContext';

Geocoder.init(GEOLOCATION_API_KEY);

export default function LocationPicker({
    onSelect,
    selectedLocation,
    disabled
}) {
    const [showMap, setShowMap] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 51.1657,
        longitude: 10.4515,
        latitudeDelta: 30,
        longitudeDelta: 30

        // Default cooridnates for Europe
    });
    const { deviceLocation } = useLocation();

    useEffect(() => {
        const getAddressFromCoordinates = () => {
            if (selectedLocation) {
                const [latitude, longitude] = selectedLocation
                    .split(',')
                    .map(parseFloat);
                Geocoder.from({ latitude, longitude })
                    .then((json) => {
                        const address = json.results[0].formatted_address;
                        setSelectedAddress(address);
                    })
                    .catch((error) => console.warn(error));
            } else if (deviceLocation) {
                const [latitude, longitude] = deviceLocation
                    .split(',')
                    .map(parseFloat);
                Geocoder.from({ latitude, longitude })
                    .then((json) => {
                        const address = json.results[0].formatted_address;
                        setSelectedAddress(address);
                    })
                    .catch((error) => console.warn(error));
            }
        };

        getAddressFromCoordinates();

        if (selectedLocation) {
            const [latitude, longitude] = selectedLocation
                .split(',')
                .map(parseFloat);
            setMapRegion((prevRegion) => ({
                ...prevRegion,
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002
            }));
        } else if (deviceLocation) {
            const [latitude, longitude] = deviceLocation
                .split(',')
                .map(parseFloat);
            setMapRegion((prevRegion) => ({
                ...prevRegion,
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002
            }));
            onSelect((prev) => ({ ...prev, location: deviceLocation }));
        }
    }, [selectedLocation, deviceLocation]);

    const handleLocationSelect = (location) => {
        onSelect((prev) => ({ ...prev, location }));
        setShowMap(false);
    };

    return (
        <>
            {showMap ? (
                <>
                    <TouchableOpacity
                        style={stylesLocation.closeIconWrapper}
                        onPress={() => setShowMap(false)}
                    >
                        <CloseIcon style={stylesLocation.closeIcon} />
                    </TouchableOpacity>
                    {!disabled && (
                        <MapView
                            style={{ width: '100%', height: 200 }}
                            region={mapRegion}
                            onPress={(e) =>
                                handleLocationSelect(
                                    `${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}`
                                )
                            }
                        >
                            {selectedLocation && (
                                <Marker
                                    coordinate={{
                                        latitude: parseFloat(
                                            selectedLocation.split(',')[0]
                                        ),
                                        longitude: parseFloat(
                                            selectedLocation.split(',')[1]
                                        )
                                    }}
                                />
                            )}
                        </MapView>
                    )}
                </>
            ) : (
                <TouchableOpacity
                    onPress={() => setShowMap(true)}
                    style={stylesLocation.fieldLink}
                    disabled={disabled}
                >
                    <Text
                        style={[
                            stylesLocation.fielText,
                            !disabled && stylesLocation.fieldLinkText
                        ]}
                    >
                        {selectedAddress
                            ? selectedAddress
                            : 'Fill the location'}
                    </Text>
                </TouchableOpacity>
            )}
        </>
    );
}

const stylesLocation = StyleSheet.create({
    fieldLink: {
        flexShrink: 1,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 16,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline',
        flexShrink: 1
    },
    fielText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000'
    },
    closeIconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -4
    },
    closeIcon: {
        width: 14,
        height: 14,
        color: '#000'
    }
});

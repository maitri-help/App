import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import CloseIcon from '../../assets/icons/close-icon.svg';
import { GEOLOCATION_API_KEY, GOOGLE_MAPS_API_KEY } from '../../constants/config';
import { useLocation } from '../../context/LocationContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SearchIcon from '../../assets/icons/search-icon.svg';

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

    const [predefinedSearchPlaces, setPredefinedSearchPlaces] = useState([]);

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

    useEffect(() => {
        if (deviceLocation) {
            const [latitude, longitude] = deviceLocation.split(',').map(parseFloat);
            setPredefinedSearchPlaces((prev) => [
                {
                    description: 'Current location',
                    geometry: {
                        location: {
                            lat: latitude,
                            lng: longitude
                        }
                    }
                },
                ...prev
            ]);
        }
    }, [deviceLocation, setPredefinedSearchPlaces]);

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
                        <>
                            <View style={{ width: '100%' }}>
                                <GooglePlacesAutocomplete
                                    query={{
                                        key: GOOGLE_MAPS_API_KEY,
                                        language: 'en'
                                    }}
                                    placeholder="Search for places..."
                                    fetchDetails={true}
                                    GooglePlacesDetailsQuery={{ fields: "geometry" }}
                                    onPress={(data, details) => {
                                        setTimeout(() => {
                                            handleLocationSelect(
                                                `${details.geometry.location.lat},${details.geometry.location.lng}`
                                            );
                                        }, 50);
                                    }}
                                    onFail={(error) => console.error(error)}
                                    enablePoweredByContainer={false}
                                    disableScroll={true}
                                    /* currentLocation={true}
                                    currentLocationLabel='Current location' */
                                    predefinedPlaces={predefinedSearchPlaces}
                                    renderLeftButton={() => 
                                        <View style={{
                                            height: 38,
                                            borderBottomColor: '#E5E5E5',
                                            borderBottomWidth: 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            paddingRight: 10,
                                        }}>
                                            <SearchIcon
                                                width={16}
                                                height={16}
                                                color="#9F9F9F"
                                            />
                                        </View>
                                    }
                                    textInputProps={{
                                        placeholderTextColor: '#9F9F9F',
                                    }}          
                                    styles={{
                                        container: {
                                            flex: 0,
                                            width: '100%',
                                        },
                                        textInput: {
                                            height: 38,
                                            borderRadius: 0,
                                            borderBottomColor: '#E5E5E5',
                                            borderBottomWidth: 1,
                                            paddingHorizontal: 0,
                                            paddingVertical: 0,
                                            fontFamily: 'poppins-regular',
                                            fontSize: 13,
                                            color: '#000',
                                        },
                                        predefinedPlacesDescription: {
                                            color: '#1C4837',
                                        },
                                        row: {
                                            paddingHorizontal: 0,
                                            paddingVertical: 10,
                                        },
                                        separator: {
                                            height: 0.5,
                                            backgroundColor: '#E5E5E5',
                                        },
                                        description: {
                                            fontFamily: 'poppins-regular',
                                            fontSize: 13,
                                            color: '#9F9F9F',
                                        },
                                    }}
                                />
                            </View>
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
                        </>
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

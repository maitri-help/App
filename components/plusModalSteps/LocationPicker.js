import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform, Modal, Pressable, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import CloseIcon from '../../assets/icons/close-icon.svg';
import CheckIcon from '../../assets/icons/check-icon.svg';
import { GEOLOCATION_API_KEY, GOOGLE_MAPS_API_KEY } from '../../constants/config';
import { useLocation } from '../../context/LocationContext';
import { useUser } from '../../context/UserContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SearchIcon from '../../assets/icons/search-icon.svg';
import LocationPinIcon from '../../assets/icons/location-pin-icon.svg';
import styles from '../../Styles';
import { checkAuthentication } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { getUser, saveLocation } from '../../hooks/api';

Geocoder.init(GEOLOCATION_API_KEY);

export default function LocationPicker({
    onSelect,
    selectedLocation,
    disabled,
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
    const { userData, setUserData } = useUser();
    const toast = useToast();

    const [predefinedSearchPlaces, setPredefinedSearchPlaces] = useState([]);
    const [currentSelectedLocation, setCurrentSelectedLocation] = useState(
        selectedLocation || deviceLocation || null
    );
    

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
        }
    }, [selectedLocation, deviceLocation]);

    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

    useEffect(() => {
        const getAddressFromCoordinates = () => {
            if (currentSelectedLocation) {
                const [latitude, longitude] = currentSelectedLocation
                    .split(',')
                    .map(parseFloat);
                Geocoder.from({ latitude, longitude })
                    .then((json) => {
                        const address = json.results[0].formatted_address;
                        setCurrentSelectedAddress(address);
                    })
                    .catch((error) => console.warn(error));
            }
        };

        getAddressFromCoordinates();

        if (currentSelectedLocation) {
            const [latitude, longitude] = currentSelectedLocation
                .split(',')
                .map(parseFloat);
            setMapRegion((prevRegion) => ({
                ...prevRegion,
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002
            }));
        }
    }, [currentSelectedLocation]);

    const getPredefinedSearchPlaces = (refresh = false) => {
        setPredefinedSearchPlaces([]);

        if (userData.savedLocations && userData.savedLocations.length > 0) {
            setPredefinedSearchPlaces((prev) => [
                ...userData.savedLocations.map((savedLocation) => ({
                    description: savedLocation.description,
                    geometry: {
                        location: {
                            lat: savedLocation.location.split(',')[0],
                            lng: savedLocation.location.split(',')[1]
                        }
                    }
                })),
                ...prev
            ]);
        }

        if (deviceLocation && !refresh) {
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
    };

    useEffect(() => {
        if (predefinedSearchPlaces.length > 0) return;
        getPredefinedSearchPlaces();
    }, [predefinedSearchPlaces]);

    const handleLocationChange = (location) => {
        setCurrentSelectedLocation(location);
    };

    const handleLocationSelect = () => {
        onSelect((prev) => ({ ...prev, location: currentSelectedLocation }));
        setShowMap(false);
    };

    const handleCloseMap = () => {
        setCurrentSelectedLocation(selectedLocation || deviceLocation || null);
        onSelect((prev) => ({ ...prev, location: selectedLocation || deviceLocation || null }));
        setShowMap(false);
    };

    const [saveModalVisible, setSaveModalVisible] = useState(false);
    const [locationName, setLocationName] = useState('');
    const [locationNameError, setLocationNameError] = useState('');

    const handleLocationSave = async () => {
        if (!locationName) {
            setLocationNameError('Please enter a location name');
            return;
        }

        if (locationName.length < 3 || locationName.length > 50) {
            setLocationNameError('Location name must be between 3 and 50 characters');
            return;
        }

        try {
            if (userData && userData.accessToken) {
                const accessToken = userData.accessToken;

                const locationData = {
                    location: currentSelectedLocation,
                    description: locationName
                };

                const res = await saveLocation(locationData, accessToken)
                    .catch((error) => {
                        if (error.response?.data?.message) {
                            toast.show(error.response.data.message, { type: 'error' });
                        }
                    });
                
                if (res) {
                    if (res.status && res.status === 201) {
                        toast.show('Location saved successfully', { type: 'success' });
                        
                        const userData = await checkAuthentication();

                        if (!userData) {
                            toast.show('Unable to refresh. Please close and reopen app.', { type: 'error' });
                        } else {
                            setUserData(userData);
                            getPredefinedSearchPlaces(true);
                        }
                    }
                }   
            }
        } catch (error) {
            toast.show('Unkown error', { type: 'error' });
        }

        setSaveModalVisible(false);
    };

    return (
        <>
            {showMap ? (
                <>
                    <View style={stylesLocation.iconsWrapper}>
                        <TouchableOpacity
                            style={stylesLocation.closeIconWrapper}
                            onPress={() => handleCloseMap()}
                        >
                            <CloseIcon
                                width={18}
                                height={18}
                                color={'#000'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleLocationSelect()}
                            style={stylesLocation.closeIconWrapper}
                        >
                            <CheckIcon
                                width={20}
                                height={20}
                                color={'#000'}
                            />
                        </TouchableOpacity>
                    </View>
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
                                            handleLocationChange(
                                                `${details.geometry.location.lat},${details.geometry.location.lng}`
                                            )
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
                                    handleLocationChange(
                                        `${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}`
                                    )
                                }
                            >
                                {currentSelectedLocation && (
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(
                                                currentSelectedLocation.split(',')[0]
                                            ),
                                            longitude: parseFloat(
                                                currentSelectedLocation.split(',')[1]
                                            )
                                        }}
                                    />
                                )}
                            </MapView>
                            <View style={stylesLocation.saveButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => setSaveModalVisible(true)}
                                    style={stylesLocation.saveButton}
                                >
                                    <Text style={stylesLocation.saveButtonText}>Save This Location</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </>
            ) : (
                <>
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
                </>
            )}
            {saveModalVisible && (
                <Modal
                    visible={saveModalVisible}
                    onRequestClose={() => setSaveModalVisible(false)}
                    animationType="fade"
                    transparent
                >
                    <Pressable
                        onPress={() => setSaveModalVisible(false)}
                        style={stylesLocation.innerModalContainer}
                    >
                        <Pressable>
                            <View style={stylesLocation.innerModalContent}>
                                <View style={stylesLocation.innerModalHeader}>
                                    <Text style={stylesLocation.innerModalTitle}>Save Location</Text>
                                    <Pressable
                                        onPress={() => setSaveModalVisible(false)}
                                    >
                                        <CloseIcon
                                            width={18}
                                            height={18}
                                            color={'#000'}
                                        />
                                    </Pressable>
                                </View>
                                <View style={stylesLocation.innerModalAddress}>
                                    <LocationPinIcon
                                        width={24}
                                        height={24}
                                        color={'#1C4837'}
                                    />
                                    <Text style={stylesLocation.innerModalAddressText}>{currentSelectedAddress}</Text>
                                </View>
                                <TextInput 
                                    style={[styles.input, stylesLocation.innerModalInput, locationNameError && { borderColor: '#FF0000' }]}
                                    placeholder="Enter location name"
                                    onChange={(e) => {
                                        setLocationName(e.nativeEvent.text);
                                        setLocationNameError('');
                                    }}
                                />
                                <Text style={stylesLocation.innerModalInputError}>{locationNameError}</Text>
                                <View style={stylesLocation.innerModalButtons}>
                                    <TouchableOpacity
                                        style={[
                                            stylesLocation.innerModalButton,
                                            stylesLocation.innerModalButtonWhite
                                        ]}
                                        onPress={() => setSaveModalVisible(false)}
                                    >
                                        <Text
                                            style={[
                                                stylesLocation.innerModalButtonText,
                                                stylesLocation.innerModalButtonWhiteText
                                            ]}
                                        >
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            stylesLocation.innerModalButton,
                                            stylesLocation.innerModalButtonGreen
                                        ]}
                                        onPress={handleLocationSave}
                                    >
                                        <Text
                                            style={[
                                                stylesLocation.innerModalButtonText,
                                                stylesLocation.innerModalButtonGreenText
                                            ]}
                                        >
                                            Save
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
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
    iconsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
    },
    closeIconWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -4
    },
    saveButtonContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#1C4837',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6
    },
    saveButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        color: '#fff'
    },
    innerModalContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        maxWidth: 500,
    },
    innerModalHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    innerModalTitle: {
        fontSize: 16,
        fontFamily: 'poppins-medium',
    },
    innerModalAddress: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        maxWidth: 300,
    },
    innerModalAddressText: {
        fontFamily: 'poppins-regular',
    },
    innerModalInput: {
        height: 30,
        marginVertical: 10,
        minWidth: 200,
        paddingVertical: 0
    },
    innerModalInputError: {
        color: '#FF0000',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
    },
    innerModalButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginVertical: 10,
    },
    innerModalButton: {
        alignItems: 'center',
        minWidth: 125,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8
    },
    innerModalButtonGreen: {
        backgroundColor: '#1C4837'
    },
    innerModalButtonWhite: {
        backgroundColor: '#fff'
    },
    innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18
    },
    innerModalButtonGreenText: {
        color: '#fff'
    },
    innerModalButtonWhiteText: {
        color: '#000'
    }
});

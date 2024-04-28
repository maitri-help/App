import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import CloseIcon from '../../assets/icons/close-icon.svg';

Geocoder.init("AIzaSyAWwo2zm6v7Jwam7QGxAFGkCH1DhsgGB_Y");

export default function LocationPicker({ onSelect, selectedLocation, disabled }) {
    const [showMap, setShowMap] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: 51.1657,
        longitude: 10.4515,
        latitudeDelta: 30,
        longitudeDelta: 30,

        // Default cooridnates for Europe
    });

    useEffect(() => {
        const getAddressFromCoordinates = () => {
            if (selectedLocation) {
                Geocoder.from(selectedLocation)
                    .then((json) => {
                        const address = json.results[0].formatted_address;
                        setSelectedAddress(address);
                    })
                    .catch((error) => console.warn(error));
            }
        };

        getAddressFromCoordinates();

        if (selectedLocation) {
            setMapRegion(prevRegion => ({
                ...prevRegion,
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            }));
        }
    }, [selectedLocation]);

    const handleLocationSelect = (location) => {
        onSelect(location);
        setShowMap(false);
    };

    return (
        <>
            {showMap ? (
                <>
                    <TouchableOpacity onPress={() => setShowMap(false)}>
                        <CloseIcon width={15} height={15} color={'#000'} />
                    </TouchableOpacity>
                    <MapView
                        style={{ width: '100%', height: 200 }}
                        region={mapRegion}
                        onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
                    >
                        {selectedLocation && <Marker coordinate={selectedLocation} />}
                    </MapView>
                </>
            ) : (
                <TouchableOpacity onPress={() => setShowMap(true)} style={[stylesLocation.fieldLink, { maxWidth: 250 }]} disabled={disabled}>
                    <Text style={[stylesLocation.fielText, !disabled && stylesLocation.fieldLinkText]}>{selectedAddress ? selectedAddress : "Fill the location"}</Text>
                </TouchableOpacity>
            )}
        </>
    );
}

const stylesLocation = StyleSheet.create({
    fieldLink: {
        flexShrink: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 16,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline',
        flexShrink: 1,
    },
    fielText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000',
    },
});
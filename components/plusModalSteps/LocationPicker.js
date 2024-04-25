import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyAWwo2zm6v7Jwam7QGxAFGkCH1DhsgGB_Y");

export default function LocationPicker({ onSelect, selectedLocation, disabled }) {
    const [showMap, setShowMap] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        if (selectedLocation) {
            Geocoder.from(selectedLocation)
                .then((json) => {
                    const address = json.results[0].formatted_address;
                    setSelectedAddress(address);
                })
                .catch((error) => console.warn(error));
        }
    }, [selectedLocation]);

    const handleLocationSelect = (location) => {
        onSelect(location);
        setShowMap(false);
    };

    return (
        <>
            {showMap ? (
                <MapView
                    style={{ width: 250, height: 200 }}
                    onPress={(e) => handleLocationSelect(e.nativeEvent.coordinate)}
                >
                    {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
            ) : (
                <TouchableOpacity onPress={() => setShowMap(true)} style={stylesLocation.fieldLink} disabled={disabled}>
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
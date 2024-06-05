import React from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const LocationPermissionModal = ({
    locationPermissionNeeded,
    handleGoToSettings
}) => {
    return (
        <Modal
            visible={locationPermissionNeeded}
            onRequestClose={() => console.log('close')}
            animationType="fade"
            transparent
        >
            <TouchableOpacity
                onPress={() => console.log('close')}
                style={stylesCal.innerModalContainer}
            >
                <View style={stylesCal.innerModalContent}>
                    <View style={stylesCal.innerModalTexts}>
                        <Text style={stylesCal.innerModalTitle}>
                            Please provide access for this app to the device's
                            location.
                        </Text>
                        <Text style={stylesCal.innerModalSubtitle}>
                            We need your location to position the map the
                            closest to you as possible.
                        </Text>
                    </View>
                    <View style={stylesCal.innerModalButtons}>
                        <TouchableOpacity
                            style={[
                                stylesCal.innerModalButton,
                                stylesCal.innerModalButtonRed
                            ]}
                            onPress={handleGoToSettings}
                        >
                            <Text
                                style={[
                                    stylesCal.innerModalButtonText,
                                    stylesCal.innerModalButtonRedText
                                ]}
                            >
                                Go to Settings
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default LocationPermissionModal;

const stylesCal = StyleSheet.create({
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
        maxWidth: 350,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    innerModalTexts: {
        marginBottom: 20
    },
    innerModalTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 5
    },
    innerModalSubtitle: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center'
    },
    innerModalButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center'
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
    innerModalButtonRed: {
        backgroundColor: '#FF7070'
    },
    innerModalButtonWhite: {
        backgroundColor: '#fff'
    },
    innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18
    },
    innerModalButtonRedText: {
        color: '#fff'
    },
    innerModalButtonWhiteText: {
        color: '#000'
    }
});

import React from 'react';
import {
    Linking,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const CalendarPermissionModal = ({
    calendarPermissionNeeded,
    setCalendarPermissionNeeded
}) => {
    const handleGoToSettings = () => {
        Linking.openSettings();
        setCalendarPermissionNeeded(false);
    };

    return (
        <Modal
            visible={calendarPermissionNeeded}
            onRequestClose={() => console.log('close')}
            animationType="fade"
            transparent
        >
            <TouchableOpacity
                onPress={() => console.log('close')}
                style={stylesModal.innerModalContainer}
            >
                <View style={stylesModal.innerModalContent}>
                    <View style={stylesModal.innerModalTexts}>
                        <Text style={stylesModal.innerModalTitle}>
                            Please provide access for this app to your calendar.
                        </Text>
                        <Text style={stylesModal.innerModalSubtitle}>
                            Without acces we cannot export this event to your
                            calendar.
                        </Text>
                    </View>
                    <View style={stylesModal.innerModalButtons}>
                        <TouchableOpacity
                            style={[
                                stylesModal.innerModalButton,
                                stylesModal.innerModalButtonRed
                            ]}
                            onPress={handleGoToSettings}
                        >
                            <Text
                                style={[
                                    stylesModal.innerModalButtonText,
                                    stylesModal.innerModalButtonRedText
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

export default CalendarPermissionModal;

const stylesModal = StyleSheet.create({
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
    },
    innerModalButtonRedText: {
        color: '#fff'
    },
    innerModalButtonRed: {
        backgroundColor: '#FF7070'
    }
});

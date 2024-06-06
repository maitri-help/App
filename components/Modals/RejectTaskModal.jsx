import React from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const RejectTaskModal = ({ showInnerModal, closeInnerModal, handleSubmit }) => {
    return (
        <Modal
            visible={showInnerModal}
            animationType="fade"
            onRequestClose={closeInnerModal}
            transparent
        >
            <TouchableOpacity
                onPress={closeInnerModal}
                style={stylesModal.innerModalContainer}
            >
                <View style={stylesModal.innerModalContent}>
                    <View style={stylesModal.innerModalTexts}>
                        <Text style={stylesModal.innerModalTitle}>
                            You are about to remove this task from your list
                        </Text>
                    </View>
                    <View style={stylesModal.innerModalButtons}>
                        <TouchableOpacity
                            style={[
                                stylesModal.innerModalButton,
                                stylesModal.innerModalButtonGreen
                            ]}
                            onPress={handleSubmit}
                        >
                            <Text
                                style={[
                                    stylesModal.innerModalButtonText,
                                    stylesModal.innerModalButtonGreenText
                                ]}
                            >
                                Remove
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                stylesModal.innerModalButton,
                                stylesModal.innerModalButtonWhite
                            ]}
                            onPress={closeInnerModal}
                        >
                            <Text
                                style={[
                                    stylesModal.innerModalButtonText,
                                    stylesModal.innerModalButtonWhiteText
                                ]}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

export default RejectTaskModal;

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
    }
});

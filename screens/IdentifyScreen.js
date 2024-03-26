import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Formik } from 'formik';
import styles from '../Styles';
import { useToast } from 'react-native-toast-notifications';
import IdentifyAlmostThereScreen from './IdentifyAlmostThereScreen';

export default function IdentifyScreen({ navigation }) {
    const toast = useToast();
    const [showAlmostThere, setShowAlmostThere] = useState(false);

    const handleAlmostThere = () => {
        setShowAlmostThere(true);
    };

    const handleCloseAlmostThere = () => {
        setShowAlmostThere(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Formik
                initialValues={{ role: '' }}
                onSubmit={(values) => {
                    if (values.role === 'Lead') {
                        navigation.navigate('Main');
                    } else if (values.role === 'Supporter') {
                        handleAlmostThere();
                    } else {
                        toast.show('Please select a role', {
                            type: 'error',
                            duration: 3000,
                        });
                    }
                }}
            >
                {({ handleChange, handleSubmit, values, errors, setFieldValue, setFieldTouched }) => (
                    <View style={[styles.container, stylesIdentify.identifyContainer]}>
                        <View style={[styles.topTextsContainer, stylesIdentify.textsContainer]}>
                            <Text style={[styles.title, stylesIdentify.title]}>Hey There,</Text>
                            <Text style={[styles.text, stylesIdentify.text]}>Before we start, we'd like to get to know you a little better to customize your experience.</Text>
                            <Text style={[styles.text, stylesIdentify.text]}>Which of the following best describes you?</Text>
                        </View>
                        <View style={stylesIdentify.formContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setFieldValue('role', 'Lead');
                                    handleSubmit();
                                }}
                                style={[
                                    stylesIdentify.optionButton,
                                    values.role === 'Lead' && stylesIdentify.activeOption,
                                ]}
                            >
                                <View style={[
                                    stylesIdentify.optionButtonBorder,
                                    values.role === 'Lead' && stylesIdentify.optionButtonBorderActive,
                                ]}></View>
                                <View style={stylesIdentify.optionButtonTop}>
                                    <Image source={require('../assets/emojis/lead-icon.png')} style={stylesIdentify.emoji} />
                                    <Text style={stylesIdentify.optionButtonTitle}>Lead</Text>
                                </View>
                                <Text style={stylesIdentify.optionButtonText}>I'm experiencing a situation of need and am looking for support</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setFieldValue('role', 'Supporter');
                                    handleSubmit();
                                }}
                                style={[
                                    stylesIdentify.optionButton,
                                    values.role === 'Supporter' && stylesIdentify.activeOption,
                                ]}
                            >
                                <View style={[
                                    stylesIdentify.optionButtonBorder,
                                    values.role === 'Supporter' && stylesIdentify.optionButtonBorderActive,
                                ]}></View>
                                <View style={stylesIdentify.optionButtonTop}>
                                    <Image source={require('../assets/emojis/rock-icon.png')} style={stylesIdentify.emoji} />
                                    <Text style={stylesIdentify.optionButtonTitle}>Supporter</Text>
                                </View>
                                <Text style={stylesIdentify.optionButtonText}>I've been invited to join a support circle and lend a helping hand</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            visible={showAlmostThere}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={handleCloseAlmostThere}
                        >
                            <IdentifyAlmostThereScreen onClose={handleCloseAlmostThere} />
                        </Modal>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
}

const stylesIdentify = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
    textsContainer: {
        gap: 10,
        marginBottom: 60,
    },
    formContainer: {
        paddingHorizontal: 30,
        alignItems: 'center',
        gap: 30,
        width: '100%',
    },
    optionButton: {
        maxWidth: '100%',
        width: 310,
        height: 100,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        borderRadius: '50%',
        borderColor: '#737373',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeOption: {
        borderColor: 'transparent',
    },
    optionButtonBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        maxWidth: '100%',
        width: 310,
        height: 100,
        borderColor: '#1C4837',
        borderRadius: '50%',
        borderWidth: 6,
        backgroundColor: 'transparent',
        opacity: 0,
    },
    optionButtonBorderActive: {
        opacity: 1,
    },
    optionButtonTop: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 5,
    },
    optionButtonTitle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
    },
    emoji: {
        width: 22,
        height: 22,
    },
    optionButtonText: {
        color: '#7A7A7A',
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
        textAlign: 'center'
    }
});

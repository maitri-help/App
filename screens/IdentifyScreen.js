import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Formik } from 'formik';
import styles from '../Styles';
import { useToast } from 'react-native-toast-notifications';
import IdentifyAlmostThereScreen from './IdentifyAlmostThereScreen';
import ThankYouScreen from './ThankYouScreen';
import { joinTribe, updateUserType } from '../hooks/api';
import { updateUserTypeInStorage, checkAuthentication } from '../authStorage';

export default function IdentifyScreen({ navigation, route }) {
    const toast = useToast();
    const [almostThereModalVisible, setAlmostThereModalVisible] = useState(false);
    const [thankYouModalVisible, setThankYouModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const { userId } = route.params;

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication(); 
                if (userData) {
                    console.log('User data:', userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.navigate('Login');
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        if (almostThereModalVisible || thankYouModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [almostThereModalVisible, thankYouModalVisible]);

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <Formik
                    initialValues={{ role: '' }}
                    onSubmit={(values) => {
                        if (values.role === 'Lead') {
                            updateUserType(userId, values.role)
                                .then(() => {
                                    toast.show('Welcome to Maitri!', { type: 'success' });
                                    updateUserTypeInStorage('Lead');
                                    navigation.navigate('Main');
                                })
                                .catch((error) => {
                                    console.error('Error updating user type:', error);
                                    toast.show('An error occurred. Please try again.', {
                                        type: 'error',
                                        duration: 3000,
                                    });
                                });
                        } else if (values.role === 'Supporter') {
                            setAlmostThereModalVisible(true);
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
                        </View>
                    )}
                </Formik>
            </SafeAreaView>

            {(almostThereModalVisible || thankYouModalVisible) && (
                <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
            )}

            <IdentifyAlmostThereScreen
                visible={almostThereModalVisible}
                onClose={() => setAlmostThereModalVisible(false)}
                navigation={navigation}
                setThankYouModalVisible={setThankYouModalVisible}
                joinTribe={joinTribe}
                userId={userId}
            />

            <ThankYouScreen
                visible={thankYouModalVisible}
                onClose={() => setThankYouModalVisible(false)}
                setAlmostThereModalVisible={setAlmostThereModalVisible}
            />
        </>
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
    },
    optionButton: {
        width: 310,
        height: 100,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        borderRadius: 50,
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
        minWidth: '100%',
        width: 310,
        height: 100,
        borderColor: '#1C4837',
        borderRadius: 50,
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
        fontFamily: 'poppins-medium',
    },
    emoji: {
        width: 22,
        height: 22,
    },
    optionButtonText: {
        color: '#7A7A7A',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        textAlign: 'center'
    }
});

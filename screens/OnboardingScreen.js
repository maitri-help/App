import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import AppButton from '../components/Button';
import styles from '../Styles';
import { setOnboardingCompleted } from '../authStorage';

export default function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const swiperRef = useRef(null);

    const navigation = useNavigation();

    const onboardingData = [
        {
            image: require('../assets/img/onboarding-welcome.png'),
            title: 'Welcome to Maitri',
            text: 'A new way to ask for help.',
        },
        {
            image: require('../assets/img/onboarding-build-tribe.png'),
            title: 'Build your tribe',
            text: 'Engage your community and create a support network you can lean on.',
        },
        {
            image: require('../assets/img/onboarding-share-load.png'),
            title: 'Share the load',
            text: 'Set up tasks to make any situation of need easier and more manageable.',
        },
    ];

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.onIndexChanged = (index) => setCurrentStep(index);
        }
    }, []);

    const handleSkip = () => {
        if (currentStep < onboardingData.length - 1) {
            setCurrentStep(onboardingData.length - 1);
            swiperRef.current.scrollBy(onboardingData.length - 1 - currentStep);
        }
    };

    const handleCreateAccount = async () => {
        await setOnboardingCompleted(true);
        navigation.navigate('Register');
    };

    const handleLogin = async () => {
        await setOnboardingCompleted(true);
        navigation.navigate('Login');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Swiper
                ref={swiperRef}
                loop={false}
                index={currentStep}
                showsButtons={false}
                showsPagination={false}
                onIndexChanged={(index) => setCurrentStep(index)}
            >
                {onboardingData.map((step, index) => (
                    <View key={index} style={styles.container}>
                        <Image source={step.image} style={stylesOnboard.onboardingImg} />
                        <View style={stylesOnboard.onboardingTextContainer}>
                            <Text style={styles.title}>{step.title}</Text>
                            <Text style={[styles.text, stylesOnboard.onboardingText]}>{step.text}</Text>
                        </View>
                        {index === onboardingData.length - 1 && (
                            <View style={stylesOnboard.onboardingButtonsContainer}>
                                <View style={styles.buttonContainer}>
                                    <AppButton
                                        onPress={handleCreateAccount}
                                        title="Create Account"
                                        buttonStyle={stylesOnboard.buttonStyle}
                                    />
                                </View>
                                <TouchableOpacity onPress={handleLogin}>
                                    <Text style={stylesOnboard.haveAccountText}>Already have an account? <Text style={stylesOnboard.loginText}>Log in</Text></Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </Swiper>
            <TouchableOpacity onPress={handleSkip} style={stylesOnboard.fixedSkipButton}>
                <Text style={stylesOnboard.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <View style={stylesOnboard.dotsContainer}>
                {onboardingData.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[stylesOnboard.dot, index === currentStep && stylesOnboard.activeDot]}
                        onPress={() => swiperRef.current.scrollTo(index)}
                    />
                ))}
            </View>
        </View>
    );
}

const stylesOnboard = StyleSheet.create({
    onboardingImg: {
        resizeMode: 'contain',
        width: 350,
        height: 290,
        marginTop: -140,
        marginBottom: 10,
    },
    dotsContainer: {
        width: '100%',
        position: 'absolute',
        bottom: '28%',
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#A3A3A3',
        marginHorizontal: 2,
    },
    activeDot: {
        backgroundColor: '#000',
        width: 20,
    },
    onboardingTextContainer: {
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 30,
    },
    onboardingText: {
        textAlign: 'center',
    },
    fixedSkipButton: {
        position: 'absolute',
        top: 70,
        right: 25,
        zIndex: 1,
    },
    skipButtonText: {
        fontFamily: 'poppins-semibold',
        textDecorationLine: 'underline',
        fontSize: 14,
        padding: 5,
    },
    onboardingButtonsContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        width: '100%',
        alignItems: 'center',
        gap: 30,
    },
    buttonStyle: {
        width: '100%',
    },
    haveAccountText: {
        textDecorationLine: 'underline',
        fontSize: 14,
        fontFamily: 'poppins-regular',
    },
    loginText: {
        fontFamily: 'poppins-semibold',
    }
});

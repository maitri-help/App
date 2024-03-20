import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import AppButton from '../compontents/Button';
import styles from '../Styles';

export default function OnboardingScreen({ navigation }) {
    const [currentStep, setCurrentStep] = useState(0);
    const swiperRef = useRef(null);

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

    return (
        <View style={{ flex: 1 }}>
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
                                        onPress={() => navigation.navigate('Register')}
                                        title="Create Account"
                                        buttonStyle={stylesOnboard.buttonStyle}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={stylesOnboard.haveAccountText}>Already have an account? <Text style={stylesOnboard.loginText}>Log in</Text></Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {index < onboardingData.length - 1 && (
                            <TouchableOpacity onPress={handleSkip} style={stylesOnboard.skipButton}>
                                <Text style={stylesOnboard.skipButtonText}>Skip</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </Swiper>
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
    skipButton: {
        position: 'absolute',
        top: 70,
        right: 25,
    },
    skipButtonText: {
        fontWeight: '600',
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
        fontSize: 15,
    },
    loginText: {
        fontWeight: '600',
        fontFamily: 'poppins-semibold',
    }
});

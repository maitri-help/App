import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import { getUser, verifyOtp } from '../hooks/api';
import { clearUserData, storeAccessToken } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { handleResend } from '../hooks/handleResend';
import { OTP_LENGTH } from '../constants/variables';
import { useUser } from '../context/UserContext';
import { ScrollView } from 'react-native-gesture-handler';
import { OtpInput } from 'react-native-otp-entry';

export default function VerifyNumberScreen({ route, navigation }) {
    const { phoneNumber, userId } = route.params;
    const toast = useToast();
    const { setUserData } = useUser();

    const [errors, setErrors] = useState({});
    const [countdown, setCountdown] = useState(30);
    const [resendClickable, setResendClickable] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(timer);
                    setResendClickable(true);
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleResendPress = () => {
        handleResend(phoneNumber, setCountdown, setResendClickable, toast);
    };

    const handleSubmit = (enteredOtp) => {
        if (!enteredOtp.match(/^\d+$/) || enteredOtp.length !== OTP_LENGTH) {
            setErrors({ otp: 'Invalid Code. Only numbers allowed.' });
            return;
        }

        verifyOtp(phoneNumber, enteredOtp)
            .then((response) => {
                const accessToken = response.data.accessToken;
                storeAccessToken(accessToken);

                getUser(phoneNumber, accessToken)
                    .then((response) => {
                        const userData = response.data;
                        setUserData({ ...userData, accessToken });
                    })
                    .catch((error) => {
                        console.error('Error fetching user data:', error);
                        clearUserData();
                        navigation.navigate('Login');
                    });
                navigation.navigate('Success', { userId });
                toast.show('Signed in successfully', { type: 'success' });
            })
            .catch((error) => {
                console.error('OTP Verification Error:', error);
                setErrors({ otp: 'Invalid Code. Please try again.' });
                toast.show('Invalid Code. Please try again.', {
                    type: 'error'
                });
            });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={[styles.container, styles.authContainer]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backLink}
                    >
                        <ArrowLeftIcon
                            width={18}
                            height={18}
                            style={styles.backLinkIcon}
                        />
                    </TouchableOpacity>
                    <View style={styles.topTextsContainer}>
                        <Text style={[styles.title, stylesVerify.title]}>
                            Verify your Number
                        </Text>
                        <Text style={[styles.text, stylesVerify.text]}>
                            Enter the 6-digit code verification code sent to
                            your phone
                        </Text>
                    </View>
                    <OtpInput 
                        numberOfDigits={OTP_LENGTH}
                        type={'numeric'}
                        onTextChange={() => setErrors({})}
                        onFilled={(text) => handleSubmit(text)}
                        theme={{
                            containerStyle: stylesVerify.otpInputContainer,
                            pinCodeContainerStyle: {
                                ...stylesVerify.otpInput, 
                                ...errors.otp && stylesVerify.errorInput
                            },
                            focusStickStyle: stylesVerify.otpInputStick,
                            pinCodeTextStyle: stylesVerify.otpInputText,
                            focusedPinCodeContainerStyle: {
                                ...stylesVerify.otpInputFocused, 
                                ...errors.otp && stylesVerify.errorInputFocused
                            },
                        }}
                    />
                    {errors.otp && (
                        <Text style={[styles.errorText, stylesVerify.errorMessage]}>{errors.otp}</Text>
                    )}

                    <View style={stylesVerify.bottomTextsContainer}>
                        <Text style={stylesVerify.bottomTitle}>
                            Didn't receive a code?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={
                                resendClickable ? handleResendPress : null
                            }
                        >
                            <Text
                                style={[
                                    stylesVerify.bottomText,
                                    resendClickable
                                        ? stylesVerify.resendClickable
                                        : null
                                ]}
                            >
                                {countdown > 0
                                    ? `Resend in 00:${countdown
                                            .toString()
                                            .padStart(2, '0')}s`
                                    : 'Resend'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const stylesVerify = StyleSheet.create({
    title: {
        textAlign: 'center'
    },
    text: {
        textAlign: 'center'
    },
    otpInputContainer: {
        gap: 10, 
        marginTop: 100,
        marginBottom: 15,
        width: 'auto',
    },
    otpInputStick: {
        backgroundColor: '#1C4837',
        height: 20
    },
    otpInputText: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        color: '#252525',
        fontFamily: 'poppins-regular'
    },
    otpInput: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    otpInputFocused: {
        borderColor: '#1C4837',
    },
    errorMessage: {
        marginLeft: 25
    },
    errorInput: {
        borderColor: '#EE0004'
    },
    errorInputFocused: {
        borderColor: '#EE0004'
    },
    bottomTextsContainer: {
        marginTop: 60,
        alignItems: 'center',
        gap: 10
    },
    bottomTitle: {
        fontFamily: 'poppins-semibold',
        fontSize: 15
    },
    bottomText: {
        fontFamily: 'poppins-regular',
        fontSize: 14,
        color: '#7A7A7A'
    },
    resendClickable: {
        color: '#000',
        fontFamily: 'poppins-medium',
        textDecorationLine: 'underline'
    }
});

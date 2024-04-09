import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import { verifyOtp } from '../hooks/api';
import { storeAccessToken } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { handleResend } from '../hooks/handleResend';

const OTP_LENGTH = 6;

const validationSchema = yup.object().shape({
    otp: yup
        .string()
        .required('Code is required')
        .matches(/^\d+$/, 'Code must be numeric')
        .min(OTP_LENGTH, `Code must be exactly ${OTP_LENGTH} digits`)
        .max(OTP_LENGTH, `Code must be exactly ${OTP_LENGTH} digits`),
});

export default function VerifyNumberScreen({ route, navigation }) {
    const { phoneNumber, userId } = route.params;
    const toast = useToast();

    const otpInputRef = useRef([]);
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
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

    const handleOtpChange = (index, value, setErrors) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (index < OTP_LENGTH - 1 && value !== '') {
            otpInputRef.current[index + 1].focus();
        }
        if (index === OTP_LENGTH - 1 && value !== '') {
            const enteredOtp = newOtp.join('');
            handleSubmit(enteredOtp);
        }
        setErrors({});
    };

    const handleSubmit = (enteredOtp) => {
        verifyOtp(phoneNumber, enteredOtp)
            .then((response) => {
                const accessToken = response.data.accessToken;
                storeAccessToken(accessToken);
                console.log('OTP Verification Response:', response.data);
                navigation.navigate('Success', { userId });
                toast.show('Signed in successfully', { type: 'success' });
            })
            .catch((error) => {
                console.error('OTP Verification Error:', error);
                toast.show('Invalid Code. Please try again.', { type: 'error' });
            });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => Keyboard.dismiss()}
                activeOpacity={1}
            >
                <Formik
                    initialValues={{ otp: '' }}
                    onSubmit={() => { }}
                    validationSchema={validationSchema}
                >
                    {({ handleChange, setErrors, errors, touched }) => (
                        <View style={[styles.container, styles.authContainer]}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
                                <ArrowLeftIcon style={styles.backLinkIcon} />
                            </TouchableOpacity>
                            <View style={styles.topTextsContainer}>
                                <Text style={[styles.title, stylesVerify.title]}>Verify your Number</Text>
                                <Text style={[styles.text, stylesVerify.text]}>Enter the 6-digit code verification code sent to your phone</Text>
                            </View>
                            <View style={stylesVerify.otpInputContainer}>
                                {otp.map((value, index) => (
                                    <TextInput
                                        key={index}
                                        style={[
                                            stylesVerify.otpInput,
                                            index === OTP_LENGTH - 1 && value !== '' ? stylesVerify.lastInput : null,
                                            errors.otp && touched.otp && touched.otp[index] ? stylesVerify.errorInput : null,
                                        ]}
                                        onChangeText={(text) => handleOtpChange(index, text, setErrors)}
                                        value={value}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        ref={(ref) => (otpInputRef.current[index] = ref)}
                                    />
                                ))}
                            </View>
                            {touched.otp && errors.otp &&
                                <Text style={styles.errorText}>{errors.otp}</Text>
                            }

                            <View style={stylesVerify.bottomTextsContainer}>
                                <Text style={stylesVerify.bottomTitle}>Didn't receive a code? </Text>
                                <TouchableOpacity onPress={resendClickable ? handleResendPress : null}>
                                    <Text style={[stylesVerify.bottomText, resendClickable ? stylesVerify.resendClickable : null]}>
                                        {countdown > 0 ? `Resend in 00:${countdown.toString().padStart(2, '0')}s` : 'Resend'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const stylesVerify = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 100,
        marginBottom: 15,
    },
    otpInput: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 23,
        color: '#252525',
        fontFamily: 'poppins-regular',
    },
    errorInput: {
        borderColor: '#EE0004',
    },
    bottomTextsContainer: {
        marginTop: 60,
        alignItems: 'center',
        gap: 10,
    },
    bottomTitle: {
        fontFamily: 'poppins-semibold',
        fontSize: 15,
    },
    bottomText: {
        fontFamily: 'poppins-regular',
        fontSize: 14,
        color: '#7A7A7A'
    },
    resendClickable: {
        color: '#000',
        fontFamily: 'poppins-medium',
        textDecorationLine: 'underline',
    }
});

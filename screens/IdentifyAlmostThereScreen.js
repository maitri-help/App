import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, Animated, TouchableWithoutFeedback, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import { useToast } from 'react-native-toast-notifications';
import styles from '../Styles';

const OTP_LENGTH = 6;

const validationSchema = yup.object().shape({
    otp: yup
        .string()
        .required('Code is required')
        .matches(/^\d+$/, 'Code must be numeric')
        .min(OTP_LENGTH, `Code must be exactly ${OTP_LENGTH} digits`)
        .max(OTP_LENGTH, `Code must be exactly ${OTP_LENGTH} digits`),
});

export default function IdentifyAlmostThereScreen({ onClose }) {
    const toast = useToast();
    const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
    const otpInputs = useRef([]);
    const translateY = new Animated.Value(400);

    const handleSubmit = (enteredOtp) => {
        if (enteredOtp === '000000') {
            toast.show('Welcome to Maitri!', { type: 'success' });
            navigation.navigate('Main');
        } else {
            toast.show('Invalid Code. Please try again.', { type: 'error' });
        }
    };

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: 200,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleClose = () => {
        Animated.timing(translateY, {
            toValue: 400,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Animated.View style={[styles.container, styles.authContainer, { transform: [{ translateY }] }]}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => Keyboard.dismiss()}
                            activeOpacity={1}
                        >
                            <Formik
                                initialValues={{ otp: '' }}
                                onSubmit={() => handleSubmit(otpValues.join(''))}
                                validationSchema={validationSchema}
                            >
                                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
                                    <View style={[styles.container, styles.authContainer]}>
                                        <TouchableOpacity onPress={handleClose} style={styles.backLink}>
                                            <ArrowLeftIcon width={20} height={20} color={'#000'} />
                                        </TouchableOpacity>
                                        <View style={styles.topTextsContainer}>
                                            <Text style={[styles.title, stylesVerify.title]}>Almost there!</Text>
                                            <Text style={[styles.text, stylesVerify.text]}>Use the 6 digit code from your invite to join and start spreading the love!</Text>
                                        </View>
                                        <View style={stylesVerify.otpInputContainer}>
                                            {[...Array(OTP_LENGTH)].map((_, index) => (
                                                <TextInput
                                                    key={index}
                                                    style={[
                                                        stylesVerify.otpInput,
                                                        errors.otp && touched.otp && touched.otp[index] && values.otp.length !== OTP_LENGTH ? stylesVerify.errorInput : null,
                                                    ]}
                                                    onChangeText={(text) => {
                                                        const newOtpValues = [...otpValues];
                                                        newOtpValues[index] = text;
                                                        setOtpValues(newOtpValues);
                                                        const enteredOtp = newOtpValues.join('');
                                                        const isAllFieldsFilled = newOtpValues.every(value => value !== '');
                                                        if (isAllFieldsFilled) {
                                                            if (enteredOtp === '000000') {
                                                                toast.show('Joining successful!', { type: 'success' });
                                                                navigation.navigate('Main');
                                                            } else {
                                                                toast.show('Invalid Code. Please try again.', { type: 'error' });
                                                            }
                                                        } else {
                                                            if (text.length === 1 && index < OTP_LENGTH - 1) {
                                                                otpInputs.current[index + 1].focus();
                                                            }
                                                        }
                                                    }}
                                                    value={otpValues[index]}
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    ref={(ref) => (otpInputs.current[index] = ref)}
                                                />
                                            ))}
                                        </View>
                                        {touched.otp && errors.otp && values.otp.length !== OTP_LENGTH && (
                                            <Text style={styles.errorText}>{errors.otp}</Text>
                                        )}

                                        <View style={stylesVerify.bottomTextsContainer}>
                                            <TouchableOpacity onPress={handleClose}>
                                                <Text style={stylesVerify.bottomText}>
                                                    I don't have a code
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
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
        color: '#252525',
        fontWeight: '400',
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
    bottomText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        fontFamily: 'poppins-medium',
        textDecorationLine: 'underline',
    },
});

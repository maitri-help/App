import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Modal from '../components/Modal';

const OTP_LENGTH = 6;

const validationSchema = yup.object().shape({
    otp: yup
        .string()
        .required('Code is required')
        .matches(/^\d+$/, 'Code must be numeric')
        .min(OTP_LENGTH, `Code must be exactly ${OTP_LENGTH} digits`)
        .max(OTP_LENGTH, `Code must be exactly ${OTP_LENGTH} digits`),
});

export default function IdentifyAlmostThereScreen({ visible, onClose, navigation, setThankYouModalVisible }) {
    const toast = useToast();
    const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
    const otpInputs = useRef([]);

    return (
        <Modal visible={visible} onClose={onClose}>
            <TouchableOpacity onPress={onClose} style={styles.backLink}>
                <ArrowLeftIcon style={styles.backLinkIcon} />
            </TouchableOpacity>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => Keyboard.dismiss()}
                activeOpacity={1}
            >
                <Formik
                    initialValues={{ otp: '' }}
                    validationSchema={validationSchema}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
                        <View style={[styles.container, styles.authContainer]}>
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
                                                    toast.show('Welcome to Maitri!', { type: 'success' });
                                                    navigation.navigate('Main');
                                                    onClose();
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
                                <TouchableOpacity onPress={() => {
                                    onClose();
                                    setThankYouModalVisible(true);
                                }}>
                                    <Text style={stylesVerify.bottomText}>
                                        I don't have a code
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </TouchableOpacity>
        </Modal >
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
        marginVertical: 15,
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
        marginTop: 15,
        alignItems: 'center',
        gap: 10,
    },
    bottomText: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'poppins-medium',
        textDecorationLine: 'underline',
    },
});

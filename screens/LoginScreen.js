import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import PhoneIcon from '../assets/icons/phone-icon.svg';
import ExclamationIcon from '../assets/icons/exclamation-icon.svg';
import ArrowIcon from '../assets/icons/arrow-icon.svg';
import styles from '../Styles';
import handleSignIn from '../hooks/handleSignIn';
import { useToast } from 'react-native-toast-notifications';
import { checkAuthentication } from '../authStorage';

const validationSchema = yup.object().shape({
    phoneNumber: yup
        .string()
        .matches(
            /^(?:(?:\+|00)(?:[1-9]\d{0,2}))?(?:\s*\d{7,})$/,
            'Enter a valid phone number - No spaces or any special characters only "+" allowed.'
        )
        .required('Phone Number is required')
});

export default function LoginScreen({ navigation }) {
    const [isFormValid, setIsFormValid] = useState(false);
    const toast = useToast();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication();
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
            }
        }
        fetchUserData();
    }, []);

    const handleFormSubmit = async (values) => {
        try {
            const { userId, otpResponse } = await handleSignIn(values);

            toast.show('Code is sent to: ' + values.phoneNumber, {
                type: 'success'
            });
            navigation.navigate('AlmostThere', {
                phoneNumber: values.phoneNumber,
                userId
            });
        } catch (error) {
            console.error('Sign in error:', error);
            toast.show(`Phone number doesn't exist.`, { type: 'error' });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Formik
                initialValues={{ phoneNumber: '' }}
                onSubmit={handleFormSubmit}
                validationSchema={validationSchema}
                validateOnChange={true}
                validateOnBlur={false}
                validateOnMount={false}
                initialErrors={{}}
                enableReinitialize={true}
                validate={(values) => {
                    validationSchema
                        .validate(values, { abortEarly: false })
                        .then(() => {
                            setIsFormValid(true);
                        })
                        .catch(() => {
                            setIsFormValid(false);
                        });
                }}
            >
                {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                    isValid
                }) => (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={[styles.container, styles.authContainer]}>
                            <View style={styles.topTextsContainer}>
                                <Text style={[styles.title, stylesLogin.title]}>
                                    Welcome Back!
                                </Text>
                                <Text style={[styles.text, stylesLogin.text]}>
                                    Login to your Maitri account
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.formContainer,
                                    stylesLogin.formContainer
                                ]}
                            >
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+1 Phone Number"
                                        value={values.phoneNumber}
                                        onChangeText={(text) => {
                                            const newValue = text.replace(
                                                /\s/g,
                                                ''
                                            );
                                            setFieldValue(
                                                'phoneNumber',
                                                newValue
                                            );
                                        }}
                                        keyboardType="phone-pad"
                                        onBlur={() =>
                                            setFieldTouched('phoneNumber')
                                        }
                                    />
                                    {touched.phoneNumber &&
                                    errors.phoneNumber ? (
                                        <ExclamationIcon
                                            style={styles.inputErrorIcon}
                                            width={20}
                                            height={20}
                                        />
                                    ) : (
                                        <PhoneIcon
                                            style={styles.inputIcon}
                                            width={20}
                                            height={20}
                                        />
                                    )}
                                </View>
                                {touched.phoneNumber && errors.phoneNumber && (
                                    <Text style={styles.errorText}>
                                        {errors.phoneNumber}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.submitButtonContainer}>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    style={[
                                        styles.submitButton,
                                        !isFormValid && { opacity: 0.5 }
                                    ]}
                                    disabled={!isFormValid}
                                >
                                    <ArrowIcon
                                        width={18}
                                        height={18}
                                        color={'#fff'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={stylesLogin.bottomContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('Register')
                                    }
                                    style={stylesLogin.registerTextLink}
                                >
                                    <Text style={stylesLogin.newHereText}>
                                        New Here?{' '}
                                        <Text style={stylesLogin.registerText}>
                                            Sign Up
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </Formik>
        </SafeAreaView>
    );
}

const stylesLogin = StyleSheet.create({
    title: {
        textAlign: 'center'
    },
    text: {
        textAlign: 'center'
    },
    formContainer: {
        marginTop: 120
    },
    registerTextLink: {
        marginTop: 15
    },
    newHereText: {
        fontSize: 14,
        fontFamily: 'poppins-regular'
    },
    registerText: {
        fontFamily: 'poppins-semibold',
        textDecorationLine: 'underline'
    }
});

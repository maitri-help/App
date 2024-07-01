import React, { useState } from 'react';
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
import PhoneIcon from '../assets/icons/phone-icon.svg';
import ExclamationIcon from '../assets/icons/exclamation-icon.svg';
import ArrowIcon from '../assets/icons/arrow-icon.svg';
import styles from '../Styles';
import handleSignIn from '../hooks/handleSignIn';
import { useToast } from 'react-native-toast-notifications';
import { loginValidationSchema } from '../utils/validationSchemas';
import PhoneInput from 'react-native-international-phone-number';
import RightChevron from '../assets/icons/chevron-right-icon.svg';


export default function LoginScreen({ navigation }) {
    const [isFormValid, setIsFormValid] = useState(false);
    const toast = useToast();
    const [responseLoading, setResponseLoading] = useState(false);

    const handleFormSubmit = async (values) => {
        const data = {
            phoneNumber: values.phoneCountry.callingCode + values.phoneNumber.replace(/\s/g, '')
        }
        setResponseLoading(true);
        try {
            const userData = await handleSignIn(data);

            toast.show('Code is sent to: ' + data.phoneNumber, {
                type: 'success'
            });
            navigation.navigate('AlmostThere', {
                phoneNumber: data.phoneNumber,
                userId: userData?.userId
            });
            setResponseLoading(false);
        } catch (error) {
            console.error('Sign in error:', error);
            if (error.message) {
                toast.show(error.message, { type: 'error' });
            } else {
                toast.show('Unknown error', { type: 'error' });
            }
            setResponseLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Formik
                initialValues={{ phoneNumber: '', phoneCountry: null }}
                onSubmit={handleFormSubmit}
                validationSchema={loginValidationSchema}
                validateOnChange={true}
                validateOnBlur={false}
                validateOnMount={false}
                initialErrors={{}}
                enableReinitialize={true}
                validate={(values) => {
                    loginValidationSchema
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
                                <PhoneInput
                                    value={values.phoneNumber}
                                    onChangePhoneNumber={(phoneNumber) => {
                                        setFieldValue('phoneNumber', phoneNumber);
                                    }}
                                    selectedCountry={values.phoneCountry}
                                    onChangeSelectedCountry={(country) => {
                                        setFieldValue('phoneCountry', country);
                                    }}
                                    placeholder="Phone Number"
                                    defaultCountry="US"
                                    onBlur={() => setFieldTouched('phoneNumber')}
                                    phoneInputStyles={styles.phoneInputStyles}
                                    customCaret={
                                        <RightChevron style={{
                                            color: '#1C4837',
                                            transform: [{ rotate: '90deg' }],
                                        }} />
                                    }
                                    modalStyles={styles.phoneModalStyles}
                                    //modalNotFoundCountryMessage="Sorry, country not found"
                                    //modalSearchInputPlaceholder="Search..."
                                />
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
                                    disabled={!isFormValid || responseLoading}
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

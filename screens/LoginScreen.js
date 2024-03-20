import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import PhoneIcon from '../assets/icons/phone-icon.svg';
import ExclamationIcon from '../assets/icons/exclamation-icon.svg';
import ArrowIcon from '../assets/icons/arrow-icon.svg';
import styles from '../Styles';

const validationSchema = yup.object().shape({
    phoneNumber: yup.string().matches(
        /^(?:(?:\+|00)(?:[1-9]\d{0,2}))?(?:\s*\d{7,})$/,
        'Enter a valid phone number - No spaces or any special characters only "+" allowed.'
    ).required('Phone Number is required'),
});

export default function LoginScreen({ navigation }) {
    const handleSignIn = (values) => {
        console.log(values);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                style={{ flex: 1, }}
                onPress={() => Keyboard.dismiss()}
                activeOpacity={1}
            >
                <Formik
                    initialValues={{ phoneNumber: '', }}
                    onSubmit={handleSignIn}
                    validationSchema={validationSchema}
                >
                    {({ handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
                        <View style={[styles.container, styles.authContainer]}>
                            <View style={styles.topTextsContainer}>
                                <Text style={[styles.title, stylesLogin.title]}>Welcome Back!</Text>
                                <Text style={[styles.text, stylesLogin.text]}>Login to your Maitri account</Text>
                            </View>
                            <View style={styles.formContainer}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+1 Phone Number"
                                        value={values.phoneNumber}
                                        onChangeText={(text) => {
                                            const newValue = text.replace(/\s/g, '');
                                            setFieldValue('phoneNumber', newValue);
                                        }}
                                        keyboardType="phone-pad"
                                        onBlur={() => setFieldTouched('phoneNumber')}
                                    />
                                    {touched.phoneNumber && errors.phoneNumber ?
                                        <ExclamationIcon style={styles.inputErrorIcon} width={20} height={20} />
                                        :
                                        <PhoneIcon style={styles.inputIcon} width={20} height={20} />
                                    }
                                </View>
                                {touched.phoneNumber && errors.phoneNumber &&
                                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                                }
                            </View>
                            <View style={stylesLogin.submitButtonContainer}>
                                <TouchableOpacity onPress={handleSubmit} style={stylesLogin.submitButton}>
                                    <ArrowIcon width={18} height={18} color={'#fff'} />
                                </TouchableOpacity>
                            </View>
                            <View style={stylesLogin.bottomContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={stylesLogin.registerTextLink}>
                                    <Text style={stylesLogin.newHereText}>New Here? <Text style={stylesLogin.registerText}>Sign Up</Text></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const stylesLogin = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
    submitButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingTop: 40,
    },
    submitButton: {
        backgroundColor: '#1C4837',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    registerTextLink: {
        marginTop: 15,
    },
    newHereText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    registerText: {
        fontWeight: '600',
        fontFamily: 'poppins-semibold',
        textDecorationLine: 'underline',
    },
});
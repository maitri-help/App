import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, Keyboard, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../Styles';
import UserIcon from '../assets/icons/user-icon.svg';
import EmailIcon from '../assets/icons/email-icon.svg';
import PhoneIcon from '../assets/icons/phone-icon.svg';
import ExclamationIcon from '../assets/icons/exclamation-icon.svg';
import ArrowIcon from '../assets/icons/arrow-icon.svg';

const validationSchema = yup.object().shape({
    fullName: yup.string().required('Full Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phoneNumber: yup.string().matches(
        /^(?:(?:\+|00)(?:[1-9]\d{0,2}))?(?:\s*\d{7,})$/,
        'Enter a valid phone number - No spaces or any special characters only "+" allowed.'
    ).required('Phone Number is required'),
    acceptedTerms: yup.boolean().oneOf([true], 'You must accept the Privacy Policy and Terms & Conditions'),
});

export default function RegisterScreen({ navigation }) {

    const handleSignUp = (values) => {
        console.log(values);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                style={{ flex: 1, maxHeight: 667, }}
                onPress={() => Keyboard.dismiss()}
                activeOpacity={1}
            >
                <Formik
                    initialValues={{ fullName: '', email: '', phoneNumber: '', acceptedTerms: false }}
                    onSubmit={handleSignUp}
                    validationSchema={validationSchema}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched }) => (
                        <View style={[styles.container, stylesRegister.container]}>
                            <View style={stylesRegister.topTextsContainer}>
                                <Text style={[styles.title, stylesRegister.title]}>Let's Get started</Text>
                                <Text style={[styles.text, stylesRegister.text]}>Sign up and connect to your personal support hub</Text>
                            </View>
                            <View style={stylesRegister.formContainer}>
                                <View style={stylesRegister.inputWrapper}>
                                    <TextInput
                                        style={stylesRegister.input}
                                        placeholder="Full Name"
                                        value={values.fullName}
                                        onChangeText={handleChange('fullName')}
                                        onBlur={() => setFieldTouched('fullName')}
                                    />
                                    {touched.fullName && errors.fullName ?
                                        <ExclamationIcon style={stylesRegister.inputErrorIcon} width={20} height={20} />
                                        :
                                        <UserIcon style={stylesRegister.inputIcon} width={20} height={20} />
                                    }
                                </View>
                                {touched.fullName && errors.fullName &&
                                    <Text style={stylesRegister.errorText}>{errors.fullName}</Text>
                                }
                                <View style={stylesRegister.inputWrapper}>
                                    <TextInput
                                        style={stylesRegister.input}
                                        placeholder="Email"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        keyboardType="email-address"
                                        onBlur={() => setFieldTouched('email')}
                                    />
                                    {touched.email && errors.email ?
                                        <ExclamationIcon style={stylesRegister.inputErrorIcon} width={20} height={20} />
                                        :
                                        <EmailIcon style={stylesRegister.inputIcon} width={20} height={20} />
                                    }
                                </View>
                                {touched.email && errors.email &&
                                    <Text style={stylesRegister.errorText}>{errors.email}</Text>
                                }
                                <View style={stylesRegister.inputWrapper}>
                                    <TextInput
                                        style={stylesRegister.input}
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
                                        <ExclamationIcon style={stylesRegister.inputErrorIcon} width={20} height={20} />
                                        :
                                        <PhoneIcon style={stylesRegister.inputIcon} width={20} height={20} />
                                    }
                                </View>
                                {touched.phoneNumber && errors.phoneNumber &&
                                    <Text style={stylesRegister.errorText}>{errors.phoneNumber}</Text>
                                }
                                <View style={stylesRegister.formBottomContainer}>
                                    <TouchableOpacity onPress={() => { setFieldValue('acceptedTerms', !values.acceptedTerms); setFieldTouched('acceptedTerms'); }} style={stylesRegister.checkboxContainer}>
                                        <View style={[stylesRegister.checkbox]}>
                                            <View style={[values.acceptedTerms && stylesRegister.checkedCheckbox]}>
                                            </View>
                                        </View>
                                        <Text style={stylesRegister.checkboxText}>
                                            I accept the
                                            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}> Privacy Policy </Text>
                                            and
                                            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}> Terms & Conditions</Text>
                                        </Text>
                                    </TouchableOpacity>
                                    {touched.acceptedTerms && !values.acceptedTerms && errors.acceptedTerms &&
                                        <Text style={stylesRegister.errorText}>{errors.acceptedTerms}</Text>
                                    }
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={stylesRegister.loginTextLink}>
                                        <Text style={stylesRegister.haveAccountText}>Already have an account? <Text style={stylesRegister.loginText}>Log in</Text></Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={stylesRegister.submitButtonContainer}>
                                    <TouchableOpacity onPress={handleSubmit} style={stylesRegister.submitButton}>
                                        <ArrowIcon width={18} height={18} color={'#fff'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </Formik>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const stylesRegister = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        paddingHorizontal: 40,
        paddingVertical: 40,
    },
    topTextsContainer: {
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#666666',
        borderBottomWidth: 1,
        paddingLeft: 15,
        paddingRight: 40,
        paddingVertical: 5,
    },
    inputIcon: {
        color: '#000',
        position: 'absolute',
        right: 15,
        top: 15,
    },
    inputErrorIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#666666',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
    },
    checkedCheckbox: {
        backgroundColor: '#1C4837',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    checkboxText: {
        marginRight: 5,
        lineHeight: 20,
        fontSize: 13,
    },
    formBottomContainer: {
        alignItems: 'center',
        paddingTop: 20,
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
    loginTextLink: {
        marginTop: 15,
    },
    haveAccountText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'poppins-regular',
    },
    loginText: {
        fontWeight: '600',
        fontFamily: 'poppins-semibold',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
        width: '100%',
    },
});
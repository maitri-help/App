import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking, Keyboard, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from '../Styles';
import UserIcon from '../assets/icons/user-icon.svg';
import EmailIcon from '../assets/icons/email-icon.svg';
import PhoneIcon from '../assets/icons/phone-icon.svg';
import ExclamationIcon from '../assets/icons/exclamation-icon.svg';
import ArrowIcon from '../assets/icons/arrow-icon.svg';
import handleSignUp from '../hooks/handleSignUp';
import { useToast } from 'react-native-toast-notifications';

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
    const [isFormValid, setIsFormValid] = useState(false);
    const toast = useToast();

    const handleFormSubmit = async (values) => {
        console.log('Form values in handleFormSubmit:', values);

        try {
            const signUpResponse = await handleSignUp(values, navigation);
            if (signUpResponse.exists) {
                console.log('User with phone number already exists:', values.phoneNumber);
                toast.show('User with phone number already exists', { type: 'error' });
                return;
            }

            navigation.navigate('VerifyNumber', { phoneNumber: values.phoneNumber });
            toast.show('Code sent successfully to: ' + values.phoneNumber, { type: 'success' });
        } catch (error) {
            console.error('Sign up error:', error);
            toast.show('Sign up failed. Please try again.', { type: 'error' });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => Keyboard.dismiss()}
                activeOpacity={1}
            >
                <Formik
                    initialValues={{ fullName: '', email: '', phoneNumber: '', acceptedTerms: false }}
                    onSubmit={handleFormSubmit}
                    validationSchema={validationSchema}
                    validateOnChange={true}
                    validateOnBlur={false}
                    validateOnMount={false}
                    initialErrors={{}}
                    enableReinitialize={true}
                    validate={(values) => {
                        validationSchema.validate(values, { abortEarly: false })
                            .then(() => {
                                setIsFormValid(true);
                            })
                            .catch(() => {
                                setIsFormValid(false);
                            });
                    }}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, setFieldTouched, isValid }) => (
                        <View style={[styles.container, styles.authContainer]}>
                            <View style={styles.topTextsContainer}>
                                <Text style={[styles.title, stylesRegister.title]}>Let's Get started</Text>
                                <Text style={[styles.text, stylesRegister.text]}>Sign up and connect to your personal support hub</Text>
                            </View>
                            <View style={styles.formContainer}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Full Name"
                                        value={values.fullName}
                                        onChangeText={handleChange('fullName')}
                                        onBlur={() => setFieldTouched('fullName')}
                                    />
                                    {touched.fullName && errors.fullName ?
                                        <ExclamationIcon style={styles.inputErrorIcon} width={20} height={20} />
                                        :
                                        <UserIcon style={styles.inputIcon} width={20} height={20} />
                                    }
                                </View>
                                {touched.fullName && errors.fullName &&
                                    <Text style={styles.errorText}>{errors.fullName}</Text>
                                }
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        keyboardType="email-address"
                                        onBlur={() => setFieldTouched('email')}
                                    />
                                    {touched.email && errors.email ?
                                        <ExclamationIcon style={styles.inputErrorIcon} width={20} height={20} />
                                        :
                                        <EmailIcon style={styles.inputIcon} width={20} height={20} />
                                    }
                                </View>
                                {touched.email && errors.email &&
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                }
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
                                <View style={stylesRegister.formBottomContainer}>
                                    <TouchableOpacity onPress={() => { setFieldValue('acceptedTerms', !values.acceptedTerms); setFieldTouched('acceptedTerms'); }} style={styles.checkboxContainer}>
                                        <View style={[styles.checkbox]}>
                                            <View style={[values.acceptedTerms && styles.checkedCheckbox]}>
                                            </View>
                                        </View>
                                        <Text style={styles.checkboxText}>
                                            I accept the
                                            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}> Privacy Policy </Text>
                                            and
                                            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')}> Terms & Conditions</Text>
                                        </Text>
                                    </TouchableOpacity>
                                    {touched.acceptedTerms && !values.acceptedTerms && errors.acceptedTerms &&
                                        <Text style={styles.errorText}>{errors.acceptedTerms}</Text>
                                    }
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={stylesRegister.loginTextLink}>
                                        <Text style={stylesRegister.haveAccountText}>Already have an account? <Text style={stylesRegister.loginText}>Log in</Text></Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={stylesRegister.submitButtonContainer}>
                                    <TouchableOpacity onPress={handleSubmit} style={[stylesRegister.submitButton, !isFormValid && { opacity: 0.5 }]} disabled={!isFormValid}>
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
    title: {
        textAlign: 'center',
    },
    text: {
        textAlign: 'center',
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
});
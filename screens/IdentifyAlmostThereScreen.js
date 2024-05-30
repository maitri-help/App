import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useToast } from 'react-native-toast-notifications';
import styles from '../Styles';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import Modal from '../components/Modal';

const TRIBE_LENGTH = 6;

const validationSchema = yup.object().shape({
    tribe: yup
        .string()
        .required('Code is required')
        .matches(/^\d+$/, 'Code must be numeric')
        .min(TRIBE_LENGTH, `Code must be exactly ${TRIBE_LENGTH} digits`)
        .max(TRIBE_LENGTH, `Code must be exactly ${TRIBE_LENGTH} digits`)
});

export default function IdentifyAlmostThereScreen({
    visible,
    onClose,
    navigation,
    setThankYouModalVisible,
    joinTribe,
    userId
}) {
    const toast = useToast();
    const [tribeValues, setTribeValues] = useState(
        Array(TRIBE_LENGTH).fill('')
    );
    const tribeInputs = useRef([]);

    return (
        <Modal visible={visible} onClose={onClose}>
            <TouchableOpacity onPress={onClose} style={styles.backLink}>
                <ArrowLeftIcon
                    width={18}
                    height={18}
                    style={styles.backLinkIcon}
                />
            </TouchableOpacity>
            <Formik
                initialValues={{ tribe: '' }}
                validationSchema={validationSchema}
            >
                {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched
                }) => (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={[styles.container, styles.authContainer]}>
                            <View style={styles.topTextsContainer}>
                                <Text
                                    style={[styles.title, stylesVerify.title]}
                                >
                                    Almost there!
                                </Text>
                                <Text style={[styles.text, stylesVerify.text]}>
                                    Use the 6 digit code from your invite to
                                    join and start spreading the love!
                                </Text>
                            </View>
                            <View style={stylesVerify.tribeInputContainer}>
                                {[...Array(TRIBE_LENGTH)].map((_, index) => (
                                    <TextInput
                                        key={index}
                                        style={[
                                            stylesVerify.tribeInput,
                                            errors.tribe &&
                                            touched.tribe &&
                                            touched.tribe[index] &&
                                            values.tribe.length !== TRIBE_LENGTH
                                                ? stylesVerify.errorInput
                                                : null
                                        ]}
                                        onChangeText={(text) => {
                                            const newTribeValues = [
                                                ...tribeValues
                                            ];
                                            newTribeValues[index] = text;
                                            setTribeValues(newTribeValues);
                                            const enteredTribe =
                                                newTribeValues.join('');

                                            if (
                                                enteredTribe.length ===
                                                TRIBE_LENGTH
                                            ) {
                                                joinTribe(userId, enteredTribe)
                                                    .then(() => {
                                                        toast.show(
                                                            'Welcome to Maitri!',
                                                            { type: 'success' }
                                                        );
                                                        navigation.reset({
                                                            index: 0,
                                                            routes: [{ name: 'SuppGreatNews' }]
                                                        });
                                                        onClose();
                                                    })
                                                    .catch((error) => {
                                                        toast.show(
                                                            'Invalid Code. Please try again.',
                                                            { type: 'error' }
                                                        );
                                                        console.error(
                                                            'Error joining tribe:',
                                                            error
                                                        );
                                                    });
                                            } else {
                                                if (
                                                    text.length === 1 &&
                                                    index < TRIBE_LENGTH - 1
                                                ) {
                                                    tribeInputs.current[
                                                        index + 1
                                                    ].focus();
                                                }
                                            }
                                        }}
                                        value={tribeValues[index]}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        ref={(ref) =>
                                            (tribeInputs.current[index] = ref)
                                        }
                                    />
                                ))}
                            </View>
                            {touched.tribe &&
                                errors.tribe &&
                                values.tribe.length !== TRIBE_LENGTH && (
                                    <Text style={styles.errorText}>
                                        {errors.tribe}
                                    </Text>
                                )}

                            <View style={stylesVerify.bottomTextsContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        onClose();
                                        setThankYouModalVisible(true);
                                    }}
                                >
                                    <Text style={stylesVerify.bottomText}>
                                        I don't have a code
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </Formik>
        </Modal>
    );
}

const stylesVerify = StyleSheet.create({
    title: {
        textAlign: 'center'
    },
    text: {
        textAlign: 'center'
    },
    tribeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginVertical: 15
    },
    tribeInput: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 23,
        color: '#252525',
        fontFamily: 'poppins-regular'
    },
    errorInput: {
        borderColor: '#EE0004'
    },
    bottomTextsContainer: {
        marginTop: 15,
        alignItems: 'center',
        gap: 10
    },
    bottomText: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'poppins-medium',
        textDecorationLine: 'underline'
    }
});

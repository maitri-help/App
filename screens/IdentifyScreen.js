import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { Formik } from 'formik';
import styles from '../Styles';
import { useToast } from 'react-native-toast-notifications';
import IdentifyAlmostThereScreen from './IdentifyAlmostThereScreen';
import ThankYouScreen from './ThankYouScreen';
import { joinTribe, updateUserType } from '../hooks/api';
import { updateUserTypeInStorage } from '../authStorage';
import RoleSelector from '../components/RoleSelector';

export default function IdentifyScreen({ navigation, route }) {
    const toast = useToast();
    const [almostThereModalVisible, setAlmostThereModalVisible] =
        useState(false);
    const [thankYouModalVisible, setThankYouModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const [isLoading, setIsLoading] = useState(false);
    const { userId } = route.params;

    useEffect(() => {
        if (almostThereModalVisible || thankYouModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [almostThereModalVisible, thankYouModalVisible]);

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <Formik
                    initialValues={{ role: '' }}
                    onSubmit={(values) => {
                        setIsLoading(true);
                        if (values.role === 'Lead') {
                            updateUserType(userId, values.role)
                                .then(() => {
                                    toast.show('Welcome to Maitri!', {
                                        type: 'success'
                                    });
                                    updateUserTypeInStorage('Lead');
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Main' }]
                                    });
                                })
                                .catch((error) => {
                                    setIsLoading(false);
                                    console.error(
                                        'Error updating user type:',
                                        error
                                    );
                                    toast.show(
                                        'An error occurred. Please try again.',
                                        {
                                            type: 'error',
                                            duration: 3000
                                        }
                                    );
                                });
                        } else if (values.role === 'Supporter') {
                            setAlmostThereModalVisible(true);
                        } else {
                            setIsLoading(false);
                            toast.show('Please select a role', {
                                type: 'error',
                                duration: 3000
                            });
                        }
                    }}
                >
                    {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        setFieldValue,
                        setFieldTouched
                    }) => (
                        <View
                            style={[
                                styles.container,
                                stylesIdentify.identifyContainer
                            ]}
                        >
                            <View
                                style={[
                                    styles.topTextsContainer,
                                    stylesIdentify.textsContainer
                                ]}
                            >
                                <Text
                                    style={[styles.title, stylesIdentify.title]}
                                >
                                    Hey There,
                                </Text>
                                <Text
                                    style={[styles.text, stylesIdentify.text]}
                                >
                                    Before we start, we'd like to get to know
                                    you a little better to customize your
                                    experience.
                                </Text>
                                <Text
                                    style={[styles.text, stylesIdentify.text]}
                                >
                                    Which of the following best describes you?
                                </Text>
                            </View>
                            <View style={stylesIdentify.formContainer}>
                                <RoleSelector
                                    pressHnadler={() => {
                                        setFieldValue('role', 'Lead');
                                        handleSubmit();
                                    }}
                                    role={'Lead'}
                                    values={values}
                                    disabled={isLoading}
                                    imageSrc={require('../assets/emojis/lead-icon.png')}
                                    description={
                                        "I'm experiencing a situation of need and am looking for support"
                                    }
                                />
                                <RoleSelector
                                    pressHnadler={() => {
                                        setFieldValue('role', 'Supporter');
                                        handleSubmit();
                                    }}
                                    role={'Supporter'}
                                    values={values}
                                    disabled={isLoading}
                                    imageSrc={require('../assets/emojis/rock-icon.png')}
                                    description={
                                        "I've been invited to join a support circle and lend a helping hand"
                                    }
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </SafeAreaView>

            {(almostThereModalVisible || thankYouModalVisible) && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}

            <IdentifyAlmostThereScreen
                visible={almostThereModalVisible}
                onClose={() => setAlmostThereModalVisible(false)}
                navigation={navigation}
                setThankYouModalVisible={setThankYouModalVisible}
                joinTribe={joinTribe}
                userId={userId}
            />

            <ThankYouScreen
                visible={thankYouModalVisible}
                onClose={() => setThankYouModalVisible(false)}
                setAlmostThereModalVisible={setAlmostThereModalVisible}
            />
        </>
    );
}

const stylesIdentify = StyleSheet.create({
    title: {
        textAlign: 'center'
    },
    text: {
        textAlign: 'center'
    },
    textsContainer: {
        gap: 10,
        marginBottom: 60
    },
    formContainer: {
        paddingHorizontal: 30,
        alignItems: 'center',
        gap: 30
    }
});

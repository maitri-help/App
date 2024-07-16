import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Linking,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import { clearUserData } from '../authStorage';
import LogoutModal from '../components/profileModals/LogoutModal';
import DeleteModal from '../components/profileModals/DeleteModal';
import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { useUser } from '../context/UserContext';
import { useTask } from '../context/TaskContext';
import { ScrollView } from 'react-native-gesture-handler';

export default function ProfileSupporterScreen({ navigation }) {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const { userData, loading, setUserData } = useUser();
    const { setTasks } = useTask();

    const handleContactSupport = () => {
        Linking.openURL('mailto:contact@maitrihelp.com');
    };

    const handleLogout = async () => {
        try {
            await clearUserData();
            setUserData(null);
            setTasks([]);
            OneSignal.logout();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        if (logoutModalVisible || deleteModalVisible) {
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
    }, [logoutModalVisible || deleteModalVisible]);

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>
                    <View style={[styles.topBar, { borderBottomWidth: 0 }]}>
                        <Text style={stylesProfile.greetingsText}>My Profile</Text>
                    </View>
                    <View style={[styles.container, stylesProfile.container]}>
                        {loading ? (
                            <View
                                style={{
                                    minHeight: 210,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <ActivityIndicator size="large" />
                            </View>
                        ) : (
                            <View style={stylesProfile.topContent}>
                                <View style={{ paddingBottom: 20 }}>
                                    <View
                                        style={[
                                            stylesProfile.selectedEmojiItem,
                                            { borderColor: userData?.color }
                                        ]}
                                    >
                                        <Text
                                            style={stylesProfile.selectedEmojiText}
                                        >
                                            {userData?.emoji}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={stylesProfile.topContentName}>
                                    {userData?.firstName} {userData?.lastName} (
                                    {userData?.userType})
                                </Text>
                                <Text style={stylesProfile.topContentText}>
                                    {userData?.email}
                                </Text>
                                <Text style={stylesProfile.topContentText}>
                                    {userData?.phoneNumber}
                                </Text>
                            </View>
                        )}

                        <View style={stylesProfile.contentContainer}>
                            <View style={stylesProfile.buttons}>
                                <View style={stylesProfile.buttonWrapper}>
                                    <TouchableOpacity
                                        style={stylesProfile.button}
                                        onPress={handleContactSupport}
                                    >
                                        <Text style={stylesProfile.buttonText}>
                                            Contact support
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={stylesProfile.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            stylesProfile.button,
                                            stylesProfile.logoutButton
                                        ]}
                                        onPress={() => setLogoutModalVisible(true)}
                                    >
                                        <Text
                                            style={[
                                                stylesProfile.buttonText,
                                                stylesProfile.logoutButtonText
                                            ]}
                                        >
                                            Log Out
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={stylesProfile.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            stylesProfile.button,
                                            stylesProfile.logoutButton
                                        ]}
                                        onPress={() => setDeleteModalVisible(true)}
                                    >
                                        <Text
                                            style={[
                                                stylesProfile.buttonText,
                                                stylesProfile.logoutButtonText
                                            ]}
                                        >
                                            Delete Account
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={stylesProfile.linksWrapper}>
                                    <TouchableOpacity style={stylesProfile.link}>
                                        <Text
                                            style={stylesProfile.linkText}
                                            onPress={() =>
                                                Linking.openURL(
                                                    'https://www.maitrihelp.com/privacy-policy'
                                                )
                                            }
                                        >
                                            Privacy Policy
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={stylesProfile.link}
                                        onPress={() =>
                                            Linking.openURL(
                                                'https://docs.google.com/forms/d/19ZBmxPhj-EFbeM-HVExMkpEcQPfajSOBh2MXulrcNUI/edit'
                                            )
                                        }
                                    >
                                        <Text style={stylesProfile.linkText}>
                                            Report an issue
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={stylesProfile.link}
                                        onPress={() =>
                                            Linking.openURL(
                                                'https://www.maitrihelp.com/terms-conditions'
                                            )
                                        }
                                    >
                                        <Text style={stylesProfile.linkText}>
                                            Terms & Conditions
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {(logoutModalVisible || deleteModalVisible) && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}

            <LogoutModal
                visible={logoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                logout={handleLogout}
            />

            <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                navigation={navigation}
            />
        </>
    );
}

const stylesProfile = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
        lineHeight: 22,
        marginBottom: 5
    },
    container: {
        justifyContent: 'space-between'
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between'
    },
    topContent: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
        gap: 3
    },
    topContentName: {
        fontSize: 20,
        fontFamily: 'poppins-medium',
        lineHeight: 23,
        color: '#000'
    },
    topContentText: {
        fontSize: 13,
        fontFamily: 'poppins-medium',
        lineHeight: 18,
        color: '#747474'
    },
    buttons: {
        width: '100%',
        paddingTop: 10
    },
    buttonWrapper: {
        paddingHorizontal: 25,
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 25
    },
    buttonText: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'poppins-regular',
        lineHeight: 18
    },
    logoutButtonText: {
        color: '#FF7070'
    },
    linksWrapper: {
        paddingHorizontal: 25,
        paddingVertical: 15
    },
    link: {
        paddingVertical: 5
    },
    linkText: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textDecorationLine: 'underline'
    },
    illustrationWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    illustration: {
        width: 130,
        height: 130,
        resizeMode: 'contain'
    },
    selectedEmojiItem: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedEmojiText: {
        fontSize: Platform.OS === 'android' ? 60 : 65,
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 70 : 75
    }
});

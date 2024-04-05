import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/img/maitri-logo.svg';
import { getAccessToken, getUserData } from '../authStorage';

export default function ProfileScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        async function fetchUserData() {
            try {
                const accessToken = await getAccessToken();
                console.log('Access Token from authStorage:', accessToken);
                if (accessToken) {
                    const userData = await getUserData();
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setUserRole(userData.userType);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.topBar, stylesProfile.topBar]}>
                <Text style={stylesProfile.topBarText}>{firstName} {lastName} ({userRole})</Text>
            </View>
            <View style={styles.container}>
                <View style={stylesProfile.profileContainer}>
                    <Logo width={90} height={90} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const stylesProfile = StyleSheet.create({
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        fontSize: 14,
    },
    topBar: {
        justifyContent: 'center',
    },
    topBarText: {
        fontSize: 18,
        fontFamily: 'poppins-medium',
        lineHeight: 20,
    }
});
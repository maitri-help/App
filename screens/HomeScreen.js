import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../compontents/Button';
import styles from '../Styles';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={stylesHome.homeContainer}>
                <Text style={stylesHome.homeTitle}>Assignment Monthly</Text>
                <View style={styles.buttonContainer}>
                    <AppButton
                        onPress={() => navigation.navigate('Assignments')}
                        title="See assignments"
                        textStyle={styles.appButtonText}
                    />
                </View>
            </View>
        </View>
    );
}

const stylesHome = StyleSheet.create({
    homeContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontSize: 14,
        fontWeight: '400',
    },
    homeTitle: {
        color: '#1C4837',
        fontSize: 25,
        fontWeight: '700',
        fontFamily: 'poppins-bold',
    },
});
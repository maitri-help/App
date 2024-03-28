import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import styles from '../Styles';
import BellIcon from '../assets/icons/bell-icon.svg';
import CustomBox from '../compontents/CustomBox';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <Text style={stylesHome.greetingsText}>Good morning Ben!</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={stylesHome.bellWrapper}>
                    <BellIcon style={stylesHome.bellIcon} />
                    <View style={stylesHome.indicator}></View>
                </TouchableOpacity>
            </View>
            <View style={stylesHome.boxesContainer}>
                <ScrollView horizontal={true} style={stylesHome.boxesScroll}>
                    <View style={{ marginLeft: 20 }} />
                    <CustomBox
                        title="Rachel Green "
                        subtitle="Has completed"
                        largerText="Do the Laundry"
                        buttons={[{ title: 'Say thank you!', bgColor: '#fff', textColor: '#000' }]}
                        bgColor="#FFE8D7"
                        bgImgColor="#FFD8BC"
                    />
                    <CustomBox
                        title="You haven't approved"
                        largerText="Phoebe Buffay"
                        secondSubtitle="For a long time"
                        buttons={[
                            { title: 'Confirm', bgColor: '#D4EED0', textColor: '#000' },
                            { title: 'Decline', bgColor: '#fff', textColor: '#000' }
                        ]}
                        bgColor="#E1D0FD"
                        bgImg={3}
                        bgImgColor="#EDE3FE"
                    />
                    <CustomBox
                        title="Nothing to do?"
                        buttons={[{ title: 'Add a new task' }]}
                        bgColor="#E5F5E3"
                        bgImgColor="#D6EFD2"
                        bgImg={4}
                    />
                    <CustomBox
                        title="[Advice here, up to 6 short lines from the “quotes and advice” doc]"
                        bgColor="#D4E6E5"
                        bgImgColor="#B7D6D3"
                    />
                    <CustomBox
                        title="Come add family & friends to your circles"
                        buttons={[{ title: 'Add a new person', bgColor: '#fff', textColor: '#000' }]}
                        bgColor="#FFE8D7"
                        bgImgColor="#FFD8BC"
                        bgImg={2}
                    />
                    <View style={{ marginRight: 20 }} />
                </ScrollView>
            </View>
            <View style={stylesHome.tasksContainer}>
                <ScrollView contentContainerStyle={stylesHome.tasksScroll}>
                    <View style={[styles.contentContainer, stylesHome.tasks]}>
                        <View style={stylesHome.tasksTop}>
                            <Text style={stylesHome.tasksWelcome}>
                                Welcome to Maitri!
                            </Text>
                            <View style={stylesHome.tasksImgWrapper}>
                                <Image source={require('../assets/img/tasks-placeholder.png')} style={stylesHome.tasksImg} />
                            </View>
                        </View>
                        <View style={stylesHome.tasksBottom}>
                            <Text style={stylesHome.tasksDescription}>
                                Click here To add your first task
                            </Text>
                            <View style={stylesHome.tasksArrowImgWrapper}>
                                <Image source={require('../assets/img/purple-arrow-down.png')} style={stylesHome.tasksArrowImg} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const stylesHome = StyleSheet.create({
    greetingsText: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
    },
    bellWrapper: {
        position: 'relative',
    },
    bellIcon: {
        width: 20,
        height: 20,
        color: '#000',
    },
    indicator: {
        backgroundColor: '#E91145',
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        bottom: 1,
        right: -4,
    },
    boxesContainer: {
        marginBottom: 20,
    },
    tasksContainer: {
        flex: 1,
    },
    tasksScroll: {
        flex: 1,
    },
    tasks: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    tasksWelcome: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'poppins-bold',
        marginBottom: 15,
    },
    tasksImgWrapper: {
        alignItems: 'center',
        marginBottom: 15,
    },
    tasksImg: {
        width: 150,
        height: 110,
        resizeMode: 'contain',
    },
    tasksDescription: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'poppins-semibold',
        marginBottom: 20,
    },
    tasksArrowImgWrapper: {
        alignItems: 'center',
        marginBottom: 20,
    },
    tasksArrowImg: {
        width: 35,
        height: 90,
        resizeMode: 'contain',
        marginLeft: -120,
    },
});
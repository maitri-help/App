import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import CirclesView from '../compontents/CirclesView';
import CircleItem from '../compontents/CircleItem';

export default function CirclesScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('All');

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const tabContents = {
        First: [
            { firstName: 'Rachel', lastName: 'Green', image: require('../assets/emojis/rock-icon.png'), circle: 'First circle' },
            { firstName: 'Phoebe', lastName: 'Buffay', image: require('../assets/emojis/smiling-face-icon.png'), circle: 'First circle' },
            { firstName: 'Joey', lastName: 'Tribbiani', image: require('../assets/emojis/cupid-icon.png'), circle: 'First circle' }
        ],
        Second: [
            { firstName: 'Chandler', lastName: 'Bing', image: require('../assets/emojis/hedgehog-icon.png'), circle: 'Second circle' },
            { firstName: 'Ross', lastName: 'Geller', image: require('../assets/emojis/waving-icon.png'), circle: 'Second circle' },
            { firstName: 'Ben', lastName: 'Geller', image: require('../assets/emojis/victory-icon.png'), circle: 'Second circle' }
        ],
        Third: [
            { firstName: 'Monica', lastName: 'Geller', image: require('../assets/emojis/unicorn-icon.png'), circle: 'Third circle' },
            { firstName: 'Richard', lastName: 'Burke', image: require('../assets/emojis/male-icon.png'), circle: 'Third circle' },
            { firstName: 'Emily', lastName: 'Waltham', image: require('../assets/emojis/female-icon.png'), circle: 'Third circle' }
        ]
    };

    const generateAllTabContent = () => {
        const allContent = [];
        ['First', 'Second', 'Third'].forEach((tab) => {
            tabContents[tab].forEach((item) => {
                allContent.push({ ...item, circle: `${tab} circle` });
            });
        });
        return allContent;
    };

    const circlesContent = (tab) => {
        if (tab === 'Circles') {
            const circleItemsContent = [
                tabContents.First[0] || { firstName: 'Peer', image: null },
                tabContents.Second[0] || { firstName: 'Friend', image: null },
                tabContents.Third[0] || { firstName: 'Parent', image: null }
            ];

            return (
                <>
                    <View style={stylesCircles.top}>
                        <Text style={stylesCircles.topText}>
                            Your Tribe is private. only you can see this
                        </Text>
                    </View>
                    <View style={stylesCircles.circlesContainer}>
                        <CirclesView circleItemsContent={circleItemsContent} />
                    </View>
                </>
            );
        } else if (tab === 'All') {
            const allContent = generateAllTabContent();
            return (
                <View style={stylesCircles.circleListItems}>
                    {allContent.map((item, index) => (
                        <CircleItem key={index} item={item} />
                    ))}
                </View>
            );
        } else {
            const tabContent = tabContents[tab] || [];
            return (
                <View style={stylesCircles.circleListItems}>
                    {tabContent.map((item, index) => (
                        <CircleItem key={index} item={item} />
                    ))}
                </View>
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={stylesCircles.scrollContainer}>
                <View style={[stylesCircles.tabsContainer, styles.contentContainer]}>
                    <TouchableOpacity onPress={() => handleTabPress('Circles')} style={[stylesCircles.tab, activeTab === 'Circles' && stylesCircles.activeTab]}>
                        <Text style={[stylesCircles.tabText, activeTab === 'Circles' && stylesCircles.activeTabText]}>Circles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabPress('All')} style={[stylesCircles.tab, activeTab === 'All' && stylesCircles.activeTab]}>
                        <Text style={[stylesCircles.tabText, activeTab === 'All' && stylesCircles.activeTabText]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabPress('First')} style={[stylesCircles.tab, activeTab === 'First' && stylesCircles.activeTab]}>
                        <Text style={[stylesCircles.tabText, activeTab === 'First' && stylesCircles.activeTabText]}>First</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabPress('Second')} style={[stylesCircles.tab, activeTab === 'Second' && stylesCircles.activeTab]}>
                        <Text style={[stylesCircles.tabText, activeTab === 'Second' && stylesCircles.activeTabText]}>Second</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabPress('Third')} style={[stylesCircles.tab, activeTab === 'Third' && stylesCircles.activeTab]}>
                        <Text style={[stylesCircles.tabText, activeTab === 'Third' && stylesCircles.activeTabText]}>Third</Text>
                    </TouchableOpacity>
                </View>

                {circlesContent(activeTab)}

            </ScrollView>
        </SafeAreaView>
    );
}

const stylesCircles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 20,
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#1C4837',
    },
    tabText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
    },
    activeTabText: {
        color: '#fff',
    },
    top: {
        marginBottom: 20,
    },
    topText: {
        textAlign: 'center',
        color: '#7A7A7A',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    },
    circlesContainer: {
        marginLeft: '-52%',
        position: 'relative',
        marginBottom: 50,
    },
    circleListItems: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 5,
        paddingBottom: 25,
    },
});
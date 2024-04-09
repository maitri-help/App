import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import CirclesView from '../compontents/CirclesView';
import CircleItem from '../compontents/CircleItem';
import PlusIcon from '../assets/icons/plus-icon.svg';

export default function CirclesScreen({ navigation }) {

    const [activeTab, setActiveTab] = useState('All');

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const tabContents = {
        First: [
            // { firstName: 'Rachel', lastName: 'Green', color: '#26847B', image: require('../assets/emojis/rock-icon.png'), circle: 'First circle' },
            // { firstName: 'Phoebe', lastName: 'Buffay', color: '#E5D9B6', image: require('../assets/emojis/smiling-face-icon.png'), circle: 'First circle' },
            // { firstName: 'Joey', lastName: 'Tribbiani', color: '#7FCC72', image: require('../assets/emojis/cupid-icon.png'), circle: 'First circle' }
        ],
        Second: [
            // { firstName: 'Chandler', lastName: 'Bing', color: '#FF8A35', image: require('../assets/emojis/hedgehog-icon.png'), circle: 'Second circle' },
            // { firstName: 'Ross', lastName: 'Geller', color: '#A571F9', image: require('../assets/emojis/waving-icon.png'), circle: 'Second circle' },
            // { firstName: 'Ben', lastName: 'Geller', color: '#7FCC72', image: require('../assets/emojis/victory-icon.png'), circle: 'Second circle' }
        ],
        Third: [
            // { firstName: 'Monica', lastName: 'Geller', image: require('../assets/emojis/unicorn-icon.png'), circle: 'Third circle' },
            // { firstName: 'Richard', lastName: 'Burke', image: require('../assets/emojis/male-icon.png'), circle: 'Third circle' },
            // { firstName: 'Emily', lastName: 'Waltham', image: require('../assets/emojis/female-icon.png'), circle: 'Third circle' }
        ]
    };

    const hasEmptyContent = () => {
        if (activeTab === 'All') {
            const allContent = generateAllTabContent();
            return allContent.length === 0;
        } else if (activeTab === 'Circles') {
            return tabContents.First.length === 0 && tabContents.Second.length === 0 && tabContents.Third.length === 0;
        } else {
            return tabContents[activeTab].length === 0;
        }
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

    const getRandomItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const circlesContent = (tab) => {
        if (tab === 'Circles') {
            const circleItemsContent = [
                getRandomItem(tabContents.First) || { firstName: 'Peer', image: null },
                getRandomItem(tabContents.Second) || { firstName: 'Friend', image: null },
                getRandomItem(tabContents.Third) || { firstName: 'Parent', image: null }
            ];

            return (
                <>
                    <View style={stylesCircles.top}>
                        <Text style={stylesCircles.topText}>
                            Your Tribe is private. Only you can see this.
                        </Text>
                    </View>
                    <View style={stylesCircles.circlesContainer}>
                        <CirclesView circleItemsContent={circleItemsContent} />
                    </View>
                </>
            );
        } else if (tab === 'All') {
            const allContent = generateAllTabContent();
            if (allContent.length === 0) {
                return (
                    <View style={[styles.contentContainer, stylesCircles.circleListEmptyContainer]}>
                        <View style={stylesCircles.circleListEmptyTexts}>
                            <Text style={stylesCircles.circleListEmptyText}>
                                You haven't invited anyone to your support circle yet.
                            </Text>
                            <Text style={stylesCircles.circleListEmptyText}>
                                Asking for help is hard. We're here to help.
                            </Text>
                        </View>
                        <Image source={require('../assets/img/mimi-flower-illustration.png')} style={stylesCircles.circleListEmptyIllustration} />
                    </View>
                );
            }

            return (
                <View style={stylesCircles.circleListItems}>
                    {allContent.map((item, index) => (
                        <CircleItem key={index} item={item} />
                    ))}
                </View>
            );
        } else {
            const tabContent = tabContents[tab] || [];
            if (tabContent.length === 0) {
                return (
                    <View style={[styles.contentContainer, stylesCircles.circleListEmptyContainer]}>
                        <Text style={stylesCircles.circleListEmptyText}>
                            There are no supporters in this circle yet.
                        </Text>
                        <Image source={require('../assets/img/mimi-hearts-illustration.png')} style={stylesCircles.circleListEmptyIllustration} />
                    </View>
                );
            }

            return (
                <View style={stylesCircles.circleListItems}>
                    {tabContent.map((item, index) => (
                        <CircleItem key={index} item={item} />
                    ))}
                </View>
            );
        }
    };

    const getFloatingButtonText = () => {
        switch (activeTab) {
            case 'Circles':
                return 'Invite a supporter';
            case 'All':
                return 'Invite your first supporter';
            default:
                return 'Invite someone';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={[stylesCircles.scrollContainer, hasEmptyContent() && !(activeTab === 'Circles') ? stylesCircles.scrollContainerFull : null]}>
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

            <View style={stylesCircles.floatingButtonWrapper}>
                {hasEmptyContent() && (
                    <View style={stylesCircles.floatingButtonEmpty}>
                        <Text style={stylesCircles.floatingButtonEmptyText}>
                            {getFloatingButtonText()}
                        </Text>
                        <Image source={require('../assets/img/purple-arrow-right.png')} style={stylesCircles.floatingButtonEmptyImg} />
                    </View>
                )}
                <TouchableOpacity style={stylesCircles.floatingButton}>
                    <PlusIcon color={'#fff'} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const stylesCircles = StyleSheet.create({
    scrollContainerFull: {
        flex: 1,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 15,
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
        marginBottom: 50,
    },
    circleListItems: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 5,
        paddingBottom: 25,
    },
    floatingButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 5,
    },
    floatingButtonEmpty: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: 'relative',
        zIndex: 1,
    },
    floatingButtonEmptyImg: {
        width: 60,
        height: 15,
        resizeMode: 'contain'
    },
    floatingButtonEmptyText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        marginBottom: 9,
    },
    floatingButton: {
        backgroundColor: '#1C4837',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 1,
        marginRight: 15,
        marginBottom: 20,
        position: 'relative',
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        marginVertical: 5,
    },
    circleListEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
    },
    circleListEmptyTexts: {
        gap: 20,
        maxWidth: 190,
    },
    circleListEmptyText: {
        textAlign: 'center',
        color: '#7A7A7A',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 20,
    },
    circleListEmptyIllustration: {
        width: 140,
        height: 135,
        resizeMode: 'contain',
    }
});
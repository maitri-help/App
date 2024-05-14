import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated } from 'react-native';
import styles from '../Styles';
import CirclesView from '../components/CirclesView';
import CircleItem from '../components/CircleItem';
import PlusIcon from '../assets/icons/plus-icon.svg';
import SendInviteScreen from './SendInviteScreen';
import SupporterCardScreen from './SupporterCardScreen';
import { circlesUsers } from '../hooks/api';
import { checkAuthentication } from '../authStorage';

export default function CirclesScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Circles');
    const [sendInvitesModalVisible, setSendInvitesModalVisible] = useState(false);
    const [supporterCardModalVisible, setSupporterCardModalVisible] = useState(false);
    const [selectedCircleItem, setSelectedCircleItem] = useState(null);
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const [tabContents, setTabContents] = useState({
        First: [],
        Second: [],
        Third: []
    });

    const [circleItemsContent, setCircleItemsContent] = useState([]);

    async function fetchCircleUsers() {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                console.log('User Data:', userData);

                const circlesResponse = await circlesUsers(userData.accessToken);

                console.log('Circles user data:', circlesResponse.data);

                const filteredData = Object.keys(circlesResponse.data)
                    .filter(key => key !== "New" && key !== "Personal" && key !== "Frist")
                    .reduce((obj, key) => {
                        obj[key] = circlesResponse.data[key];
                        return obj;
                    }, {});

                setTabContents(filteredData);
            } else {
                console.error('No user data found');
            }
        } catch (error) {
            console.error('Error fetching circle users:', error);
        }
    }

    useEffect(() => {
        fetchCircleUsers();
    }, []);


    useEffect(() => {
        generateRandomCircleItems();
    }, [tabContents]);

    const generateRandomCircleItems = () => {
        const circleItemsContent = [
            getRandomItem(tabContents.Third) || { firstName: 'Peer', emoji: null },
            getRandomItem(tabContents.Second) || { firstName: 'Friend', emoji: null },
            getRandomItem(tabContents.First) || { firstName: 'Parent', emoji: null },
        ];
        setCircleItemsContent(circleItemsContent);
    };

    const handleCircleItemPress = (item) => {
        setSelectedCircleItem(item);
        setSupporterCardModalVisible(true);
    };

    useEffect(() => {
        if (sendInvitesModalVisible || supporterCardModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [sendInvitesModalVisible || supporterCardModalVisible]);

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    };

    const handlePressCircleItemCount = (tab) => {
        setActiveTab(tab);
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
                allContent.push({ ...item, circle: `${tab}` });
            });
        });
        return allContent;
    };

    const getRandomItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const circlesContent = (tab) => {
        if (tab === 'Circles') {
            const additionalItemCountThird = Math.max(0, tabContents.Third.length - 1);
            const additionalItemCountSecond = Math.max(0, tabContents.Second.length - 1);
            const additionalItemCountFirst = Math.max(0, tabContents.First.length - 1);

            console.log('Circle items', circleItemsContent);

            return (
                <>
                    <View style={stylesCircles.top}>
                        <Text style={stylesCircles.topText}>
                            Your Tribe is private. Only you can see this.
                        </Text>
                    </View>
                    <View style={stylesCircles.circlesContainer}>
                        <CirclesView
                            circleItemsContent={circleItemsContent}
                            additionalItemCountThird={additionalItemCountThird}
                            additionalItemCountSecond={additionalItemCountSecond}
                            additionalItemCountFirst={additionalItemCountFirst}
                            onPressCircleItemCount={handlePressCircleItemCount}
                            onPressCircleItem={handleCircleItemPress}
                        />
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
                        <CircleItem key={index} item={{ ...item, circle: item.circle }} onPress={() => handleCircleItemPress(item)} />
                    ))}
                </View>
            );
        } else {
            const tabContent = tabContents[tab] || [];
            if (tabContent.length === 0) {
                return (
                    <View style={[styles.contentContainer, stylesCircles.circleListEmptyContainer]}>
                        <Text style={stylesCircles.circleListEmptyText}>
                            There are no supporters in this circle yet
                        </Text>
                        <Image source={require('../assets/img/mimi-hearts-illustration.png')} style={stylesCircles.circleListEmptyIllustration} />
                    </View>
                );
            }

            return (
                <View style={stylesCircles.circleListItems}>
                    {tabContent.map((item, index) => (
                        <CircleItem key={index} item={{ ...item, circle: tab }} onPress={() => handleCircleItemPress(item)} />
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
        <>
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
                    <TouchableOpacity style={styles.floatingButton} activeOpacity={1} onPress={() => setSendInvitesModalVisible(true)}>
                        <PlusIcon color={'#fff'} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {(sendInvitesModalVisible || supporterCardModalVisible) && (
                <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
            )}

            <SendInviteScreen
                visible={sendInvitesModalVisible}
                onClose={() => setSendInvitesModalVisible(false)}
                navigation={navigation}
            />

            <SupporterCardScreen
                visible={supporterCardModalVisible}
                onClose={() => {
                    setSupporterCardModalVisible(false);
                    setSelectedCircleItem(null);
                }}
                navigation={navigation}
                emoji={selectedCircleItem ? selectedCircleItem.emoji : ''}
                color={selectedCircleItem ? selectedCircleItem.color : ''}
                firstName={selectedCircleItem ? selectedCircleItem.firstName : ''}
                lastName={selectedCircleItem ? selectedCircleItem.lastName : ''}
                circle={selectedCircleItem ? selectedCircleItem.circle : ''}
                tasks={selectedCircleItem ? selectedCircleItem.tasks : []}
                phoneNumber={selectedCircleItem ? selectedCircleItem.phoneNumber : ''}
                email={selectedCircleItem ? selectedCircleItem.email : ''}
                nickname={selectedCircleItem ? selectedCircleItem.nickname : ''}
            />
        </>
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
        color: '#1C4837',
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
        resizeMode: 'contain',
    },
    floatingButtonEmptyText: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        marginBottom: 10,
    },
    circleListEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
    },
    circleListEmptyTexts: {
        gap: 20,
        maxWidth: 200,
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
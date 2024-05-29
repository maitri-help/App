import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    FlatList,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import styles from '../Styles';
import CirclesView from '../components/CirclesView';
import CircleItem from '../components/CircleItem';
import PlusIcon from '../assets/icons/plus-icon.svg';
import SendInviteScreen from './SendInviteScreen';
import SupporterCardScreen from './SupporterCardScreen';
import { circlesUsers } from '../hooks/api';
import { checkAuthentication } from '../authStorage';
import Tab from '../components/common/Tab';
import { circlesTabs } from '../constants/variables';

export default function CirclesScreen({ navigation }) {
    const [activeTab, setActiveTab] = useState('Circles');
    const [sendInvitesModalVisible, setSendInvitesModalVisible] =
        useState(false);
    const [supporterCardModalVisible, setSupporterCardModalVisible] =
        useState(false);
    const [selectedCircleItem, setSelectedCircleItem] = useState(null);
    const [userId, setUserId] = useState(null);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const swiperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    const tabData = circlesTabs.map((tab) => ({ key: tab }));
    const { width: screenWidth } = Dimensions.get('window');
    const [tabContents, setTabContents] = useState({
        First: [],
        Second: [],
        Third: []
    });

    const [circleItemsContent, setCircleItemsContent] = useState([]);

    async function fetchCircleUsers() {
        try {
            setIsLoading(true);
            const userData = await checkAuthentication();
            if (userData) {
                setUserId(userData.userId);

                const circlesResponse = await circlesUsers(
                    userData.accessToken
                );

                const filteredData = Object.keys(circlesResponse.data)
                    .filter(
                        (key) =>
                            key !== 'New' &&
                            key !== 'Personal' &&
                            key !== 'Frist'
                    )
                    .reduce((obj, key) => {
                        obj[key] = circlesResponse.data[key];
                        return obj;
                    }, {});

                setTabContents(filteredData);
            } else {
                console.error('No user data found');
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching circle users:', error);
            setIsLoading(false);
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
            { ...getRandomItem(tabContents.Third), circle: 'Third' } || {
                firstName: 'Peer',
                emoji: null,
                circle: 'Third'
            },
            { ...getRandomItem(tabContents.Second), circle: 'Second' } || {
                firstName: 'Friend',
                emoji: null,
                circle: 'Second'
            },
            { ...getRandomItem(tabContents.First), circle: 'First' } || {
                firstName: 'Parent',
                emoji: null,
                circle: 'First'
            }
        ];
        setCircleItemsContent(circleItemsContent);
    };

    const handleCircleItemPress = (item) => {
        const updatedItem = { ...item, circle: item.circle || activeTab };

        setSelectedCircleItem(updatedItem);
        setSupporterCardModalVisible(true);
    };

    useEffect(() => {
        if (sendInvitesModalVisible || supporterCardModalVisible) {
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
    }, [sendInvitesModalVisible || supporterCardModalVisible]);

    const handleTabPress = (tab) => {
        const tabIndex = circlesTabs.indexOf(tab);
        swiperRef.current.scrollToIndex({ index: tabIndex, animated: true });
        setActiveTab(tab);
    };

    const handlePressCircleItemCount = (tab) => {
        handleTabPress(tab);
    };

    const hasEmptyContent = () => {
        if (activeTab === 'All') {
            const allContent = generateAllTabContent();
            return allContent.length === 0;
        } else if (activeTab === 'Circles') {
            return (
                tabContents.First.length === 0 &&
                tabContents.Second.length === 0 &&
                tabContents.Third.length === 0
            );
        } else {
            return (
                tabContents[activeTab] && tabContents[activeTab].length === 0
            );
        }
    };

    const generateAllTabContent = () => {
        const allContent = [];
        ['First', 'Second', 'Third'].forEach((tab) => {
            (tabContents[tab] || []).forEach((item) => {
                allContent.push({ ...item, circle: `${tab}` });
            });
        });
        return allContent;
    };

    const getRandomItem = (array) => {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    };

    const circlesContent = (tab) => {
        if (tab === 'Circles') {
            const additionalItemCountThird = Math.max(
                0,
                tabContents.Third.length - 1
            );
            const additionalItemCountSecond = Math.max(
                0,
                tabContents.Second.length - 1
            );
            const additionalItemCountFirst = Math.max(
                0,
                tabContents.First.length - 1
            );

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
                            additionalItemCountSecond={
                                additionalItemCountSecond
                            }
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
                    <View
                        style={[
                            styles.contentContainer,
                            stylesCircles.circleListEmptyContainer
                        ]}
                    >
                        <View style={stylesCircles.circleListEmptyTexts}>
                            <Text style={stylesCircles.circleListEmptyText}>
                                You haven't invited anyone to your support
                                circle yet.
                            </Text>
                            <Text style={stylesCircles.circleListEmptyText}>
                                Asking for help is hard. We're here to help.
                            </Text>
                        </View>
                        <Image
                            source={require('../assets/img/mimi-flower-illustration.png')}
                            style={stylesCircles.circleListEmptyIllustration}
                        />
                    </View>
                );
            }

            return (
                <View style={stylesCircles.circleListItems}>
                    {allContent.map((item, index) => (
                        <CircleItem
                            key={index}
                            item={{
                                ...item,
                                circle:
                                    activeTab !== 'All'
                                        ? activeTab
                                        : item.circle
                            }}
                            activeTab={activeTab}
                            onPress={() => handleCircleItemPress(item)}
                        />
                    ))}
                </View>
            );
        } else {
            const tabContent = tabContents[tab] || [];
            if (tabContent.length === 0) {
                return (
                    <View
                        style={[
                            styles.contentContainer,
                            stylesCircles.circleListEmptyContainer
                        ]}
                    >
                        <Text style={stylesCircles.circleListEmptyText}>
                            There are no supporters in this circle yet
                        </Text>
                        <Image
                            source={require('../assets/img/mimi-hearts-illustration.png')}
                            style={stylesCircles.circleListEmptyIllustration}
                        />
                    </View>
                );
            }

            return (
                <View style={stylesCircles.circleListItems}>
                    {tabContent.map((item, index) => (
                        <CircleItem
                            key={index}
                            item={{
                                ...item,
                                circle:
                                    activeTab !== 'All'
                                        ? activeTab
                                        : item.circle
                            }}
                            activeTab={activeTab}
                            onPress={() => handleCircleItemPress(item)}
                        />
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
                <View
                    style={[
                        stylesCircles.tabsContainer,
                        styles.contentContainer
                    ]}
                >
                    {circlesTabs.map((tab, index) => (
                        <Tab
                            key={index}
                            clickHandler={() => handleTabPress(tab)}
                            label={tab}
                            isActive={activeTab === tab}
                        />
                    ))}
                </View>
                {isLoading && (
                    <View
                        style={{
                            minHeight: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            zIndex: 10
                        }}
                    >
                        <ActivityIndicator size="large" />
                    </View>
                )}
                <FlatList
                    data={tabData}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                stylesCircles.tabContent,
                                { width: screenWidth }
                            ]}
                        >
                            {circlesContent(item.key)}
                        </View>
                    )}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.floor(
                            event.nativeEvent.contentOffset.x /
                                event.nativeEvent.layoutMeasurement.width
                        );
                        setActiveTab(circlesTabs[index]);
                    }}
                    ref={swiperRef}
                    initialScrollIndex={circlesTabs.indexOf(activeTab)}
                />

                <View style={stylesCircles.floatingButtonWrapper}>
                    {hasEmptyContent() && (
                        <View style={stylesCircles.floatingButtonEmpty}>
                            <Text style={stylesCircles.floatingButtonEmptyText}>
                                {getFloatingButtonText()}
                            </Text>
                            <Image
                                source={require('../assets/img/purple-arrow-right.png')}
                                style={stylesCircles.floatingButtonEmptyImg}
                            />
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.floatingButton}
                        activeOpacity={1}
                        onPress={() => setSendInvitesModalVisible(true)}
                    >
                        <PlusIcon color={'#fff'} width={28} height={28} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {(sendInvitesModalVisible || supporterCardModalVisible) && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
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
                firstName={
                    selectedCircleItem ? selectedCircleItem.firstName : ''
                }
                lastName={selectedCircleItem ? selectedCircleItem.lastName : ''}
                initialCircle={
                    selectedCircleItem ? selectedCircleItem.circle : ''
                }
                tasks={selectedCircleItem ? selectedCircleItem.tasks : []}
                phoneNumber={
                    selectedCircleItem ? selectedCircleItem.phoneNumber : ''
                }
                email={selectedCircleItem ? selectedCircleItem.email : ''}
                nickname={selectedCircleItem ? selectedCircleItem.nickname : ''}
                circleId={selectedCircleItem ? selectedCircleItem.circleId : ''}
                supporterUserId={
                    selectedCircleItem ? selectedCircleItem.userId : ''
                }
                leadUserId={userId}
                updateUsers={() => fetchCircleUsers()}
            />
        </>
    );
}

const stylesCircles = StyleSheet.create({
    scrollContainerFull: {
        flex: 1
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 15
    },
    top: {
        marginBottom: 20
    },
    topText: {
        textAlign: 'center',
        color: '#7A7A7A',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 18
    },
    circlesContainer: {
        marginBottom: 50
    },
    circleListItems: {
        gap: 15,
        paddingHorizontal: 25,
        paddingTop: 5,
        paddingBottom: 25
    },
    floatingButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 5
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
        zIndex: 1
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
        marginBottom: 10
    },
    circleListEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40
    },
    circleListEmptyTexts: {
        gap: 20,
        maxWidth: 200
    },
    circleListEmptyText: {
        textAlign: 'center',
        color: '#7A7A7A',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 20
    },
    circleListEmptyIllustration: {
        width: 140,
        height: 135,
        resizeMode: 'contain'
    },
    tabContent: {
        flex: 1,
        paddingBottom: 100
    }
});

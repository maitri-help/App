import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Animated,
    Platform
} from 'react-native';
import styles from '../Styles';
import AppButton from '../components/Button';
import ArrowBackIcon from '../assets/icons/arrow-left-icon.svg';
import ColorPickerModal from '../components/ColorPickerModal';
import EmojiPickerModal from '../components/EmojiPickerModal';
import {
    checkAuthentication,
    clearUserData,
    clearAccessToken,
    getAccessToken
} from '../authStorage';
import { getLeadUser } from '../hooks/api';

export default function SuppIDScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [leadUserData, setLeadUserData] = useState(null);

    const [emojiModalVisible, setEmojiModalVisible] = useState(false);
    const [colorModalVisible, setColorModalVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.navigate('Login');
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await getAccessToken();
                const response = await getLeadUser(accessToken);
                const userData = response.data;
                setLeadUserData(userData);
            } catch (error) {
                console.error('Error fetching lead user data:', error);
            }
        };

        fetchData();
    }, []);

    const leadFirstName = leadUserData ? leadUserData[0].firstName : 'Lead';
    const leadLastName = leadUserData ? leadUserData[0].lastName : 'Name';

    useEffect(() => {
        setIsNextButtonDisabled(!(selectedColor && selectedEmoji));
    }, [selectedColor, selectedEmoji]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleEmojiSelect = (emoji) => {
        setSelectedEmoji(emoji);
    };

    useEffect(() => {
        if (colorModalVisible || emojiModalVisible) {
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
    }, [{ colorModalVisible, emojiModalVisible }]);

    return (
        <>
            <SafeAreaView style={[styles.safeArea]}>
                <View style={[styles.contentContainer, { height: '100%' }]}>
                    <View style={stylesSuppID.topBar}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SuppGreatNews')}
                        >
                            <ArrowBackIcon
                                width={19}
                                height={19}
                                color={'#000'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={stylesSuppID.textContainer}>
                        <Text style={[styles.title, stylesSuppID.headerText]}>
                            Hey <Text>{firstName}</Text>
                        </Text>
                        <Text
                            style={[
                                styles.text,
                                { paddingBottom: 15, fontSize: 16 },
                                stylesSuppID.paragraph
                            ]}
                        >
                            Welcome to Maitri!
                        </Text>
                        <Text style={[styles.text, stylesSuppID.paragraph]}>
                            Let's start by customizing your persona. This is how
                            you'll show up on{' '}
                            <Text style={{ fontFamily: 'poppins-bold' }}>
                                {leadFirstName} {leadLastName}
                            </Text>
                            's support circle.
                        </Text>
                        <Text style={[styles.text, stylesSuppID.paragraph]}>
                            Choose a color and emoji that best represent you.
                        </Text>
                    </View>
                    <View style={stylesSuppID.selectedEmojiWrapper}>
                        <View
                            style={[
                                stylesSuppID.selectedEmojiItem,
                                { borderColor: selectedColor }
                            ]}
                        >
                            <Text style={stylesSuppID.selectedEmojiText}>
                                {selectedEmoji}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.buttonContainer,
                            stylesSuppID.buttonContainer
                        ]}
                    >
                        <AppButton
                            title="Color"
                            onPress={() => setColorModalVisible(true)}
                            buttonStyle={stylesSuppID.customButton}
                            textStyle={stylesSuppID.customButtonText}
                        />

                        <AppButton
                            title="Emoji"
                            onPress={() => setEmojiModalVisible(true)}
                            buttonStyle={stylesSuppID.customButton}
                            textStyle={stylesSuppID.customButtonText}
                        />
                    </View>

                    <View style={stylesSuppID.nextButtonContainer}>
                        <AppButton
                            title="Next"
                            onPress={() => navigation.navigate('MainSupporter')}
                            buttonStyle={[
                                styles.nextButton,
                                isNextButtonDisabled &&
                                    stylesSuppID.nextButtonDisabled
                            ]}
                            disabled={isNextButtonDisabled}
                        />
                    </View>
                </View>
            </SafeAreaView>

            {colorModalVisible && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}
            {emojiModalVisible && (
                <Animated.View
                    style={[styles.overlay, { opacity: overlayOpacity }]}
                />
            )}

            <ColorPickerModal
                visible={colorModalVisible}
                onClose={() => setColorModalVisible(false)}
                onColorSelect={handleColorSelect}
                selectedColor={selectedColor}
            />

            <EmojiPickerModal
                visible={emojiModalVisible}
                onClose={() => setEmojiModalVisible(false)}
                onEmojiSelect={handleEmojiSelect}
                selectedColor={selectedColor}
            />
        </>
    );
}

const stylesSuppID = StyleSheet.create({
    topBar: {
        marginTop: 20
    },
    textContainer: {
        alignItems: 'center'
    },
    headerText: {
        marginBottom: 30
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 40
    },
    button: {
        backgroundColor: '#fff'
    },
    nextButtonContainer: {
        flex: 1,
        paddingTop: 25,
        justifyContent: 'flex-start'
    },
    nextButtonDisabled: {
        opacity: 0.6
    },
    customButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 20
    },
    customButtonText: {
        fontSize: 16,
        color: '#000'
    },
    selectedEmojiWrapper: {
        paddingTop: 20,
        alignItems: 'center',
        marginBottom: -10
    },
    selectedEmojiItemWrapper: {
        borderRadius: 100,
        backgroundColor: '#fff',
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.4)' : '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10
    },
    selectedEmojiItem: {
        width: 85,
        height: 85,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedEmojiText: {
        fontSize: Platform.OS === 'android' ? 40 : 50,
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 50 : 60
    }
});

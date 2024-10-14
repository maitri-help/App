import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import styles from '../Styles';
import ArrowBackIcon from '../assets/icons/arrow-left-icon.svg';
import ChatHeartIcon from '../assets/icons/chat-heart-icon.svg';
import SendMessageIcon from '../assets/icons/send-message-icon.svg';
import { useUser } from '../context/UserContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import { findIcon } from '../helpers/task.helpers';
import { getChatMessages, sendChatMessage } from '../hooks/api';
import { getAccessToken } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { formatDate } from '../helpers/date';

export default function ChatScreen({ navigation }) {
    const { userData } = useUser();
    const scrollViewRef = useRef(null);

    const toast = useToast();

    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [responseLoading, setResponseLoading] = useState(false);

    const [loadEarlier, setLoadEarlier] = useState(false);
    const [offset, setOffset] = useState(0);

    const LIMIT = 10;

    useEffect(() => {
        async function fetchMessages() {
            const accessToken = await getAccessToken();
            await getChatMessages(LIMIT, offset, accessToken)
                .then((res) => {
                    if (res.data && res.data.length > 0) {  
                        setOffset(offset + LIMIT);

                        res.data.forEach((message, index) => {
                            // insert bot message at every date change
                            /* if (index - 1 > 0 && formatDate(new Date(res.data[index - 1].createdAt)) !== formatDate(new Date(message.createdAt))) {
                                setMessages((prevMessages) => [...prevMessages,  {
                                    text: `Hi ${userData.firstName ?? 'Ben'}! I’m Mimi, your personal help concierge. What can I do for you today?`,
                                    isBot: true,
                                    suggestions: [],
                                }]);
                            } */

                            setMessages((prevMessages) => [...prevMessages, {
                                text: message.message,
                                isBot: message.isBot,
                                suggestions: message.suggestions,
                                createdAt: message.createdAt,
                            }]);
                        });
                    }
                })
                .catch((err) => console.log(err?.response?.data?.message));
        }

        if (userData) {
            /* setMessages([
                {
                    text: `Hi ${userData.firstName ?? 'Ben'}! I’m Mimi, your personal help concierge. What can I do for you today?`,
                    isBot: true,
                    suggestions: [],
                },
            ]); */
            fetchMessages();
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [userData, LIMIT]);

    const handleSubmit = async () => {
        if (userMessage === '') return;
        setResponseLoading(true);

        const accessToken = await getAccessToken();
        const newMessage = { text: userMessage, isBot: false };
        setMessages([...messages, newMessage]);
        setUserMessage('');
        scrollViewRef.current?.scrollToEnd({ animated: true });
        Keyboard.dismiss();

        // the last 50 messages will be sent
        const postMessages = [...messages, newMessage].slice(-50);
        await sendChatMessage(
            { messages: postMessages },
            accessToken
        ).then((res) => {
            if (res.data.message) {
                setMessages([...messages, newMessage, res.data.message]);
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }
        }).catch((err) => {
            toast.show(`${err.response?.data?.message ?? 'An error occured while getting an answer'}`, { type: 'error' });
        }).finally(() => {
            setResponseLoading(false);
        });

    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBar}>
                <View style={stylesChat.topBarLeft}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowBackIcon
                            width={19}
                            height={19}
                            color={'#000'}
                        />
                    </Pressable>
                    <Text style={stylesChat.topBarTitle}>
                        Mimi
                    </Text>
                </View>
                <Image
                    source={require('../assets/img/mimi-flower-illustration.png')}
                    style={stylesChat.mimi}
                />
            </View>
            <FlatList
                data={messages}
                contentContainerStyle={{ paddingTop: 100 }}
                inverted
                onEndReached={() => {
                    console.log('end reached');
                }}
                renderItem={({ item, index }) => (
                    <View>
                        {index - 1 > 0 && new Date(messages[index - 1].createdAt).getDate() < new Date(item.createdAt).getDate() && (
                            <View style={stylesChat.dateDivider}>
                                <View style={stylesChat.dateDividerLine} />
                                <View style={stylesChat.dateDividerTextContainer}>
                                    <Text style={stylesChat.dateDividerText}>{formatDate(new Date(item.createdAt))}</Text> 
                                </View>
                            </View>
                        )}
                        <View 
                            style={[
                                stylesChat.messageContainer,
                                item.isBot ? { alignItems: 'flex-end' } : { justifyContent: 'flex-end'}
                            ]}
                        >
                            {item.isBot && (
                                <View style={stylesChat.messageAvatar}>
                                    <ChatHeartIcon width={20} height={22}/>
                                </View>
                            )}
                            <View style={[stylesChat.messageBox, item.isBot ? stylesChat.botMessage : stylesChat.userMessage]}>
                                <Text style={[stylesChat.messageText, item.isBot ? stylesChat.botText : stylesChat.userText]}>
                                    {`${item.text}`}
                                </Text>
                                {item.isBot && item.suggestions && item.suggestions.length !== 0 && (
                                    item.suggestions.map((suggestion, index) => (
                                        <View key={index} style={stylesChat.suggestion}>
                                            <View style={stylesChat.suggestionLeft}>
                                                <View style={stylesChat.suggestionIconWrapper}>
                                                    <Image source={findIcon(suggestion)} style={stylesChat.suggestionIcon} />
                                                </View>
                                                <Text key={index} style={[stylesChat.messageText, stylesChat.botText]}>
                                                    {suggestion.title}
                                                </Text>
                                            </View>
                                            <Pressable style={stylesChat.suggestionBtn} onPress={() => console.log(suggestion.title)}>
                                                <Text style={[stylesChat.messageText, stylesChat.userText]}>
                                                    Add
                                                </Text>
                                            </Pressable>
                                        </View>
                                    ))
                                )}
                            </View> 
                        </View>
                    </View>
                )}
            />
            {/* <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
                automaticallyAdjustKeyboardInsets={true}
                ref={scrollViewRef}
                //onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                <View style={{ height: 20 }} />
                {messages.length !== 0 && messages.map((message, index) => (
                    <View key={index}>
                        {index - 1 > 0 && new Date(messages[index - 1].createdAt).getDate() < new Date(message.createdAt).getDate() && (
                            <View style={stylesChat.dateDivider}>
                                <View style={stylesChat.dateDividerLine} />
                                <View style={stylesChat.dateDividerTextContainer}>
                                    <Text style={stylesChat.dateDividerText}>{formatDate(new Date(message.createdAt))}</Text> 
                                </View>
                            </View>
                        )}
                        <View 
                            style={[
                                stylesChat.messageContainer,
                                message.isBot ? { alignItems: 'flex-end' } : { justifyContent: 'flex-end'}
                            ]}
                        >
                            {message.isBot && (
                                <View style={stylesChat.messageAvatar}>
                                    <ChatHeartIcon width={20} height={22}/>
                                </View>
                            )}
                            <View style={[stylesChat.messageBox, message.isBot ? stylesChat.botMessage : stylesChat.userMessage]}>
                                <Text style={[stylesChat.messageText, message.isBot ? stylesChat.botText : stylesChat.userText]}>
                                    {`${message.text}`}
                                </Text>
                                {message.isBot && message.suggestions && message.suggestions.length !== 0 && (
                                    message.suggestions.map((suggestion, index) => (
                                        <View key={index} style={stylesChat.suggestion}>
                                            <View style={stylesChat.suggestionLeft}>
                                                <View style={stylesChat.suggestionIconWrapper}>
                                                    <Image source={findIcon(suggestion)} style={stylesChat.suggestionIcon} />
                                                </View>
                                                <Text key={index} style={[stylesChat.messageText, stylesChat.botText]}>
                                                    {suggestion.title}
                                                </Text>
                                            </View>
                                            <Pressable style={stylesChat.suggestionBtn} onPress={() => console.log(suggestion.title)}>
                                                <Text style={[stylesChat.messageText, stylesChat.userText]}>
                                                    Add
                                                </Text>
                                            </Pressable>
                                        </View>
                                    ))
                                )}
                            </View> 
                        </View>
                    </View>
                ))}
            </ScrollView> */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={[
                    {position: 'absolute', width: '100%', paddingHorizontal: 20},
                    Platform.OS === 'ios' ? { bottom: 50 } : { bottom: 30 }
                ]}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                <View style={stylesChat.inputContainer}>
                    <TextInput
                        placeholder="Write your message"
                        value={userMessage}
                        onChangeText={(text) => setUserMessage(text)}
                        style={stylesChat.input}
                    />
                    <Pressable
                        onPress={handleSubmit}
                        style={{marginRight: 16}}
                        disabled={responseLoading}
                    >
                        {responseLoading ? (
                            <ActivityIndicator size="small" color={'#1C4837'} />
                        ) : (
                            <SendMessageIcon
                                width={20}
                                height={20}
                                color={'#3369FF'}
                            />
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const stylesChat = StyleSheet.create({
    topBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    topBarTitle: {
        fontSize: 20,
        fontFamily: 'poppins-semibold',
        lineHeight: 30,
        color: '#1C4837',
    },
    mimi: {
        width: 66,
        height: 66,
        marginRight: 10,
        resizeMode: 'contain'
    },
    messageContainer: {
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    messageAvatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: -15,
        paddingBottom: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        elevation: 4,
    },
    messageBox: {
        borderRadius: 30,
        padding: 15,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        elevation: 4,
    },
    botMessage: {
        backgroundColor: '#eeeeee',
        borderBottomLeftRadius: 0,
        //borderTopLeftRadius: 30,
        flex: 1,
    },
    userMessage: {
        backgroundColor: '#A4BE7B',
        borderTopRightRadius: 0,
        //borderBottomRightRadius: 30,
        maxWidth: '90%',
    },
    messageText: {
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    },
    botText: {
        color: '#000',
    },
    userText: {
        color: '#fff',
    },
    suggestion: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 5,
        borderRadius: 25,

        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        elevation: 2,
    },
    suggestionLeft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    suggestionIconWrapper: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#1C4837',
        borderWidth: 2,
        borderRadius: 50,
    },
    suggestionIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    suggestionBtn: {
        backgroundColor: '#1C4837',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 25,
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        shadowOpacity: 0.15,
        elevation: 4,
    },
    input: {
        height: 56,
        paddingHorizontal: 20,
        fontSize: 14,
        flex: 1,
        fontFamily: 'poppins-medium',
    },
    dateDivider: { 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 20,
        position: 'relative'
    },
    dateDividerLine: { 
        backgroundColor: '#1C4837',
        height: 0.5,
        width: '90%'
    },
    dateDividerTextContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    dateDividerText: {
        fontSize: 12,
        fontFamily: 'poppins-regular',
        color: '#1C4837',
    }
});
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Share
} from 'react-native';
import Modal from '../components/Modal';
import styles from '../Styles';
import ShareIcon from '../assets/icons/share-icon.svg';
import { checkAuthentication, clearUserData, clearAccessToken } from '../authStorage';

export default function SendInviteScreen({ visible, onClose, navigation }) {
    const [userTribeCode, setUserTribeCode] = useState('');

    useEffect(() => {
        async function fetchTribeCode() {
            try {
                const userData = await checkAuthentication();
                if (userData) {
                    setUserTribeCode(userData.tribeCode);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                clearUserData();
                clearAccessToken();
                navigation.navigate('Login');
            }
        }
        fetchTribeCode();
    }, []);

    const shareTribeCode = async () => {
        try {
            await Share.share({
                message: `Hey! This is a personal invite to join my tribe on Maitri - A new way to ask for help.

After you download the app, use my unique invite code to find me.

[apple app store link]
[android app store link]

${userTribeCode}`
            });
        } catch (error) {
            console.error('Error sharing tribe code:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            style={stylesInvite}
            modalTopNav
            modalTopNavChildren={
                <>
                    <Text style={styles.topBarTitle}>Grow your tribe</Text>
                </>
            }
        >
            <View style={[styles.contentContainer, stylesInvite.container]}>
                <View style={stylesInvite.topTextContainer}>
                    <Text style={stylesInvite.text}>
                        Invite family, friends, loved ones, and peers to your
                        support circle by sharing your unique invite code
                    </Text>
                </View>
                <View style={stylesInvite.tribeCodeContainer}>
                    <Text style={stylesInvite.tribeCodeLabel}>Your Tribe Code:</Text>
                    <Text style={stylesInvite.tribeCode}>{userTribeCode}</Text>
                </View>
                <View style={stylesInvite.sendInviteWrapper}>
                    <View style={stylesInvite.sendInvite}>
                        <TouchableOpacity
                            style={stylesInvite.sendInviteLink}
                            onPress={shareTribeCode}
                        >
                            <Text style={stylesInvite.sendInviteLinkText}>
                                Send Invite
                            </Text>
                        </TouchableOpacity>
                        <ShareIcon
                            color={'#000'}
                            width={16}
                            height={16}
                            style={stylesInvite.sendInviteLinkIcon}
                        />
                    </View>
                </View>
                <View style={stylesInvite.sendInviteDesc}>
                    <Text style={stylesInvite.sendInviteDescText}>
                        Anyone with this code can request to join your tribe
                    </Text>
                </View>
                <View style={stylesInvite.bottomIllustrationWrapper}>
                    <Image
                        source={require('../assets/img/mimi-hearts-illustration.png')}
                        style={stylesInvite.bottomIllustration}
                    />
                </View>
            </View>
        </Modal>
    );
}

const stylesInvite = StyleSheet.create({
    container: {
        flex: 1
    },
    modalContainer: {
        height: '80%'
    },
    topTextContainer: {
        paddingHorizontal: 15,
        marginBottom: 20
    },
    text: {
        color: '#787878',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center'
    },
    tribeCodeContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    tribeCodeLabel: {
        color: '#000',
        fontFamily: 'poppins-semibold',
        fontSize: 14,
        marginBottom: 5
    },
    tribeCode: {
        color: '#1C4837',
        fontFamily: 'poppins-bold',
        fontSize: 18
    },
    sendInviteWrapper: {
        alignItems: 'center',
        marginVertical: 20
    },
    sendInvite: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 20,
        position: 'relative',
        alignItems: 'center'
    },
    sendInviteLink: {
        paddingVertical: 10,
        paddingHorizontal: 50
    },
    sendInviteLinkText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    sendInviteLinkIcon: {
        position: 'absolute',
        top: 32,
        transform: [{ translateX: 65 }],
        pointerEvents: 'none'
    },
    sendInviteDesc: {
        paddingVertical: 15,
        paddingBottom: 30
    },
    sendInviteDescText: {
        color: '#787878',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center'
    },
    bottomIllustrationWrapper: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingBottom: 40
    },
    bottomIllustration: {
        width: 115,
        height: 115,
        resizeMode: 'contain'
    }
});

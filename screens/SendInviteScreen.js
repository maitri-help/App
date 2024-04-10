import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from '../compontents/Modal';
import styles from '../Styles';
import ShareIcon from '../assets/icons/share-icon.svg';

export default function SendInviteScreen({ visible, onClose, navigation }) {
    return (
        <Modal visible={visible} onClose={onClose} style={stylesInvite} modalTopNav
            modalTopNavChildren={
                <>
                    <Text style={styles.topBarTitle}>
                        Grow your tribe
                    </Text>
                </>
            }
        >
            <View style={[styles.contentContainer, stylesInvite.container]}>
                <View style={stylesInvite.topTextContainer}>
                    <Text style={stylesInvite.text}>
                        Invite family, friends, loved ones and peers to your support circle by sharing
                        your unique invite code
                    </Text>
                </View>
                <View style={stylesInvite.sendInviteWrapper}>
                    <View style={stylesInvite.sendInvite}>
                        <TouchableOpacity style={stylesInvite.sendInviteLink}>
                            <Text style={stylesInvite.sendInviteLinkText}>Send Invite</Text>
                        </TouchableOpacity>
                        <ShareIcon color={'#000'} width={16} height={16} style={stylesInvite.sendInviteLinkIcon} />
                    </View>
                </View>
                <View style={stylesInvite.sendInviteDesc}>
                    <Text style={stylesInvite.sendInviteDescText}>
                        Anyone with this code can request to join your tribe
                    </Text>
                </View>
                <View style={stylesInvite.bottomIllustrationWrapper}>
                    <Image source={require('../assets/img/mimi-hearts-illustration.png')} style={stylesInvite.bottomIllustration} />
                </View>
            </View>
        </Modal >
    );
}

const stylesInvite = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        height: '80%',
    },
    topTextContainer: {
        paddingHorizontal: 15,
        marginBottom: 60,
    },
    text: {
        color: '#787878',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    },
    sendInvite: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 20,
        position: 'relative',
        alignItems: 'center',
    },
    sendInviteLink: {
        paddingVertical: 10,
        paddingHorizontal: 50,
    },
    sendInviteLinkText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    sendInviteLinkIcon: {
        position: 'absolute',
        top: 32,
        transform: [{ translateX: 65 }],
        pointerEvents: 'none',
    },
    sendInviteDesc: {
        paddingVertical: 15,
        paddingBottom: 30,
    },
    sendInviteDescText: {
        color: '#787878',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
    },
    bottomIllustrationWrapper: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    bottomIllustration: {
        width: 115,
        height: 115,
        resizeMode: 'contain',
    }
});
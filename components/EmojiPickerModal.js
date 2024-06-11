import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import Modal from '../components/Modal';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import styles from '../Styles';
import EmojiSelector from '@raasz/customisable-react-native-emoji-selector';
import { updateUser } from '../hooks/api';
import { getAccessToken } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { useUser } from '../context/UserContext';

export default function EmojiPickerModal({
    visible,
    onClose,
    onEmojiSelect,
    selectedColor
}) {
    const [pressedItem, setPressedItem] = useState(null);
    const toast = useToast();

    const { userData } = useUser();

    const handlePress = async (emoji) => {
        setPressedItem(emoji);
        onEmojiSelect(emoji);

        try {
            const accessToken = await getAccessToken();
            const userDataToUpdate = {
                emoji: emoji
            };
            await updateUser(userData?.userId, userDataToUpdate, accessToken);
            toast.show('Emoji changed successfully', { type: 'success' });

            onClose();
        } catch (error) {
            toast.show('Unsuccessful emoji change', { type: 'error' });
            console.error('Error updating user emoji:', error);
        }
    };

    return (
        <Modal visible={visible} onClose={onClose} style={stylesEP}>
            <View style={styles.modalTopNav}>
                <TouchableOpacity
                    onPress={onClose}
                    style={[styles.backLink, styles.backLinkCustom]}
                >
                    <ArrowLeftIcon
                        width={18}
                        height={18}
                        style={styles.backLinkIcon}
                    />
                </TouchableOpacity>

                <Text style={[styles.topBarTitle, stylesEP.topBarTitle]}>
                    Select Your Emoji
                </Text>
            </View>
            <View style={stylesEP.selectedEmojiWrapper}>
                <View style={stylesEP.selectedEmojiItemWrapper}>
                    <View
                        style={[
                            stylesEP.selectedEmojiItem,
                            { borderColor: selectedColor }
                        ]}
                    >
                        <Text style={stylesEP.selectedEmojiText}>
                            {pressedItem}
                        </Text>
                    </View>
                </View>
            </View>
            <EmojiSelector
                onEmojiSelected={(emoji) => handlePress(emoji)}
                columns={8}
            />
        </Modal>
    );
}

const stylesEP = StyleSheet.create({
    modalContainer: {
        height: '85%'
    },
    topBarTitle: {
        paddingLeft: 40,
        flex: 1
    },
    colorListWrapper: {
        flex: 1
    },
    colorListContent: {
        justifyContent: 'center',
        gap: 20,
        padding: 16
    },
    columnWrapper: {
        flex: 1,
        alignItems: 'center'
    },
    selectedEmojiWrapper: {
        paddingTop: 30,
        alignItems: 'center',
        paddingBottom: 60
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
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedEmojiText: {
        fontSize: Platform.OS === 'android' ? 60 : 70,
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 75 : 85
    }
});

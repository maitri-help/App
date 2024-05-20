import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Platform } from 'react-native';
import ModalCustom from '../components/Modal';
import styles from '../Styles';
import EditIcon from '../assets/icons/edit-icon.svg';
import CheckIcon from '../assets/icons/check-icon.svg';
import ClockIcon from '../assets/icons/clock-icon.svg';
import PhoneIcon from '../assets/icons/phone-classic-icon.svg';
import EmailIcon from '../assets/icons/mail-icon.svg';
import { deleteSupporterFromCircle, changeUserCircle } from '../hooks/api';
import { getAccessToken } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';

export default function SupporterCardScreen({ visible, onClose, emoji, color, firstName, lastName, initialCircle, tasks = [], phoneNumber, email, circleId, supporterUserId, leadUserId, updateUsers }) {
    const [selectedCircle, setSelectedCircle] = useState(initialCircle || 'First');
    const [showInnerModal, setShowInnerModal] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (initialCircle && ['First', 'Second', 'Third'].includes(initialCircle)) {
            setSelectedCircle(initialCircle);
        }
    }, [initialCircle]);

    const handleSelectCircle = (option) => {
        setSelectedCircle(option);
        handleCircleChange(option);
        updateUsers();
    };

    const toggleEditable = () => {
        setIsEditable(!isEditable);
    };

    const openInnerModal = () => {
        setShowInnerModal(true);
    };

    const closeInnerModal = () => {
        setShowInnerModal(false);
    };

    const handleCircleChange = async (newCircle) => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            const response = await changeUserCircle(leadUserId, supporterUserId, newCircle, accessToken);
            console.log("Circle changed:", response.data);

            toast.show('Supporter circle changed successfully', { type: 'success' });

            setSelectedCircle(newCircle);
            setIsEditable(!isEditable);
            onClose();
            updateUsers();
        } catch (error) {
            console.error("Error changing circle:", error);
            toast.show('Unsuccessful circle change', { type: 'error' });
        }
    };

    const handleDelete = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.error('Access token not found. Please log in.');
                return;
            }

            const header = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await deleteSupporterFromCircle(header, circleId, supporterUserId);

            console.log("Supporter deleted from circle:", response.data);

            toast.show('Supporter deleted from circle', { type: 'success' });

            setShowInnerModal(!showInnerModal);
            setIsEditable(!isEditable);
            onClose();
            updateUsers();

        } catch (error) {
            console.error("Error deleting supporter:", error);

            toast.show('Unsuccessful supporter deletion', { type: 'error' });
        }
    };

    return (
        <ModalCustom visible={visible} onClose={onClose} style={stylesSupporter} modalTopNav
            modalTopNavChildren={
                <View style={stylesSupporter.supporterTop}>
                    <View style={stylesSupporter.supporterTopLeft}>
                        <View style={[stylesSupporter.circleItemEmojiWrapper, color ? { borderColor: color } : null]}>
                            {emoji && <Text style={stylesSupporter.circleItemEmoji}>
                                {emoji}
                            </Text>}
                        </View>
                        <View style={stylesSupporter.circleItemTextWrapper}>
                            <Text style={stylesSupporter.circleItemName}>{firstName} {lastName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={stylesSupporter.editIconWrapper} onPress={toggleEditable}>
                        {isEditable ? (
                            <CheckIcon width={22} height={22} color={'#000'} style={stylesSupporter.checkIcon} />
                        ) : (
                            <EditIcon width={22} height={22} color={'#000'} style={stylesSupporter.editIcon} />
                        )}
                    </TouchableOpacity>
                </View>
            }
        >
            <ScrollView contentContainerStyle={stylesSupporter.scrollContainer} automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesSupporter.container]}>
                    <View style={stylesSupporter.supporterNickCircles}>
                        {/* <View style={stylesSupporter.supporterNickname}>
                            {isEditable ? (
                                <TextInput
                                    style={[stylesSupporter.input, stylesSupporter.inputNickname]}
                                    maxLength={16}
                                    placeholder='Nickname'
                                    placeholderTextColor="#787878"
                                    defaultValue={firstName ? firstName : ''}
                                />
                            ) : (
                                <Text style={stylesSupporter.nickname}>
                                    {firstName ? firstName : 'Nickname'}
                                </Text>
                            )}
                        </View> */}
                        <View style={stylesSupporter.supporterCircles}>
                            {['First', 'Second', 'Third'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[stylesSupporter.supporterCircle, !isEditable && selectedCircle !== option ? stylesSupporter.supporterCircleHidden : '', selectedCircle === option && stylesSupporter.supporterCircleSelected]}
                                    onPress={() => handleSelectCircle(option)}
                                    disabled={!isEditable}
                                >
                                    <Text style={[stylesSupporter.supporterCircleText, selectedCircle === option && stylesSupporter.supporterCircleTextSelected]}>{option} circle</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={stylesSupporter.supporterTasks}>
                        <View style={stylesSupporter.supporterTasksTitle}>
                            <Text style={stylesSupporter.supporterTasksTitleText}>Recently assigned tasks</Text>
                        </View>
                        <View style={stylesSupporter.supporterTasksList}>
                            {tasks.map((task, taskIndex) => (
                                <View key={taskIndex} style={stylesSupporter.supporterTasksListItem}>
                                    <View style={[stylesSupporter.supporterTasksListItemHalf, stylesSupporter.supporterTasksListItemLeft]}>
                                        <Text style={stylesSupporter.supporterTasksListItemTask}>{task.task}</Text>
                                    </View>
                                    <View style={[stylesSupporter.supporterTasksListItemHalf, stylesSupporter.supporterTasksListItemRight]}>
                                        <ClockIcon width={14} height={14} color={'#000'} style={stylesSupporter.clockIcon} />
                                        <Text style={stylesSupporter.supporterTasksListItemTime}>{task.time}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={stylesSupporter.supporterContact}>
                        <View style={stylesSupporter.supporterContactInfo}>
                            <View style={stylesSupporter.supporterContactInfoIconCircle}>
                                <PhoneIcon width={14} height={14} color={'#1C4837'} />
                            </View>
                            {isEditable ? (
                                <TextInput
                                    style={[stylesSupporter.input, stylesSupporter.inputContact]}
                                    maxLength={16}
                                    keyboardType="numeric"
                                    defaultValue={phoneNumber ? phoneNumber : ''}
                                    placeholder={'Phone number'}
                                    placeholderTextColor="#787878"
                                />
                            ) : (
                                <Text style={stylesSupporter.supporterContactInfoText}>
                                    {phoneNumber ? phoneNumber : 'Phone number'}
                                </Text>
                            )}
                        </View>
                        <View style={stylesSupporter.supporterContactInfo}>
                            <View style={stylesSupporter.supporterContactInfoIconCircle}>
                                <EmailIcon width={14} height={14} color={'#1C4837'} />
                            </View>
                            {isEditable ? (
                                <TextInput
                                    style={[stylesSupporter.input, stylesSupporter.inputContact]}
                                    maxLength={320}
                                    keyboardType="email-address"
                                    defaultValue={email ? email : ''}
                                    placeholder={'Email address'}
                                    placeholderTextColor="#787878"
                                />
                            ) : (
                                <Text style={stylesSupporter.supporterContactInfoText}>
                                    {email ? email : 'Email address'}
                                </Text>
                            )}
                        </View>
                    </View>
                    {isEditable && (
                        <View style={stylesSupporter.supporterDelete}>
                            <TouchableOpacity style={stylesSupporter.supporterDeleteLink} onPress={openInnerModal}>
                                <Text style={stylesSupporter.supporterDeleteLinkText}>Delete Supporter</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {showInnerModal && (
                <Modal visible={showInnerModal} animationType='fade' onRequestClose={closeInnerModal} transparent>
                    <TouchableOpacity onPress={closeInnerModal} style={stylesSupporter.innerModalContainer}>
                        <View style={stylesSupporter.innerModalContent}>
                            <View style={stylesSupporter.innerModalTexts}>
                                <Text style={stylesSupporter.innerModalTitle}>You are about to remove a supporter from your tribe</Text>
                                <Text style={stylesSupporter.innerModalSubtitle}>This will not be visible to the supporter</Text>
                            </View>
                            <View style={stylesSupporter.innerModalButtons}>
                                <TouchableOpacity style={[stylesSupporter.innerModalButton, stylesSupporter.innerModalButtonRed]} onPress={handleDelete}>
                                    <Text style={[stylesSupporter.innerModalButtonText, stylesSupporter.innerModalButtonRedText]}>Remove</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[stylesSupporter.innerModalButton, stylesSupporter.innerModalButtonWhite]} onPress={closeInnerModal}>
                                    <Text style={[stylesSupporter.innerModalButtonText, stylesSupporter.innerModalButtonWhiteText]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </ModalCustom>
    );
}

const stylesSupporter = StyleSheet.create({
    modalTopNav: {
        alignItems: 'center',
    },
    innerModalContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        maxWidth: 350,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    innerModalTexts: {
        marginBottom: 20,
    },
    innerModalTitle: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 5
    },
    innerModalSubtitle: {
        color: '#000',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        textAlign: 'center',
    },
    innerModalButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    innerModalButton: {
        alignItems: 'center',
        minWidth: 125,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    innerModalButtonRed: {
        backgroundColor: '#FF7070',
    },
    innerModalButtonWhite: {
        backgroundColor: '#fff',
    },
    innerModalButtonText: {
        fontSize: 14,
        fontFamily: 'poppins-medium',
        lineHeight: 18,
    },
    innerModalButtonRedText: {
        color: '#fff',
    },
    innerModalButtonWhiteText: {
        color: '#000',
    },
    modalContainer: {
        height: '80%',
    },
    supporterTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    supporterTopLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingLeft: 5,
    },
    circleItemEmojiWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleItemEmoji: {
        fontSize: (Platform.OS === 'android') ? 24 : 28,
        textAlign: 'center',
    },
    circleItemTextWrapper: {
        flexShrink: 1,
        gap: 3,
    },
    circleItemName: {
        color: '#1C4837',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2,
    },
    editIconWrapper: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: -7,
        marginTop: -5,
    },
    editIcon: {
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
    },
    supporterNickCircles: {
        marginBottom: 20,
    },
    input: {
        color: '#000',
        fontFamily: 'poppins-regular',
        borderWidth: 0,
        padding: 0,
        margin: 0
    },
    inputNickname: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 14,
        lineHeight: 18,
        marginBottom: -2,
    },
    inputContact: {
        fontSize: 13,
        lineHeight: 18,
    },
    nickname: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    },
    supporterContactInfoText: {
        color: '#000',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
    },
    supporterCircles: {
        flexDirection: 'row',
        gap: 8,
        marginVertical: 15,
    },
    supporterCircle: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    supporterCircleSelected: {
        backgroundColor: '#1C4837',
    },
    supporterCircleHidden: {
        display: 'none',
    },
    supporterCircleText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
    },
    supporterCircleTextSelected: {
        color: '#fff',
    },
    supporterTasks: {
        marginBottom: 40,
    },
    supporterTasksTitle: {
        marginBottom: 5,
    },
    supporterTasksTitleText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 18,
        lineHeight: 22,
    },
    supporterTasksListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 15,
    },
    supporterTasksListItemHalf: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    supporterTasksListItemTask: {
        color: '#737373',
        fontSize: 13,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        flexShrink: 1,
    },
    clockIcon: {
        resizeMode: 'contain'
    },
    supporterTasksListItemTime: {
        color: '#737373',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 16,
        flexShrink: 1,
    },
    supporterContact: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        gap: 20,
        marginBottom: 10,
    },
    supporterContactInfo: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    supporterContactInfoIconCircle: {
        width: 28,
        height: 28,
        borderColor: '#B6E696',
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    supporterDelete: {
        paddingVertical: 25,
        marginBottom: 30,
    },
    supporterDeleteLinkText: {
        textAlign: 'center',
        color: '#FF7070',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        textDecorationLine: 'underline'
    }
});
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Keyboard, StyleSheet, ScrollView } from 'react-native';
import Modal from '../compontents/Modal';
import styles from '../Styles';
import EditIcon from '../assets/icons/edit-icon.svg';
import ClockIcon from '../assets/icons/clock-icon.svg';
import PhoneIcon from '../assets/icons/phone-classic-icon.svg';
import EmailIcon from '../assets/icons/mail-icon.svg';

export default function SupporterCardScreen({ visible, onClose, image, color, firstName, lastName, circle, tasks = [], phone, email, navigation }) {
    const [selectedCircle, setSelectedCircle] = useState('Third');

    useEffect(() => {
        if (circle && ['First', 'Second', 'Third'].includes(circle)) {
            setSelectedCircle(circle);
        } else {
            setSelectedCircle('Third');
        }
    }, [circle]);

    const handleSelectCircle = (option) => {
        setSelectedCircle(option);
    };

    return (
        <Modal visible={visible} onClose={onClose} style={stylesSupporter} modalTopNav
            modalTopNavChildren={
                <View style={stylesSupporter.supporterTop}>
                    <View style={stylesSupporter.supporterTopLeft}>
                        <View style={[stylesSupporter.circleItemImageWrapper, color ? { borderColor: color } : null]}>
                            {image && <Image source={image} style={stylesSupporter.circleItemImage} />}
                        </View>
                        <View style={stylesSupporter.circleItemTextWrapper}>
                            <Text style={stylesSupporter.circleItemName}>{firstName} {lastName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={stylesSupporter.editIconWrapper}>
                        <EditIcon width={22} height={22} color={'#000'} style={stylesSupporter.editIcon} />
                    </TouchableOpacity>
                </View>
            }
        >
            <ScrollView contentContainerStyle={stylesSupporter.scrollContainer} automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesSupporter.container]}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => Keyboard.dismiss()}
                        activeOpacity={1}
                    >
                        <View style={stylesSupporter.supporterNickCircles}>
                            <View style={stylesSupporter.supporterNickname}>
                                <TextInput
                                    style={stylesSupporter.input}
                                    maxLength={16}
                                    placeholder='Nickname'
                                    placeholderTextColor="#787878"
                                />
                            </View>
                            <View style={stylesSupporter.supporterCircles}>
                                <TouchableOpacity
                                    style={[stylesSupporter.supporterCircle, selectedCircle === 'First' && stylesSupporter.supporterCircleSelected]}
                                    onPress={() => handleSelectCircle('First')}
                                >
                                    <Text style={[stylesSupporter.supporterCircleText, selectedCircle === 'First' && stylesSupporter.supporterCircleTextSelected]}>First circle</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[stylesSupporter.supporterCircle, selectedCircle === 'Second' && stylesSupporter.supporterCircleSelected]}
                                    onPress={() => handleSelectCircle('Second')}
                                >
                                    <Text style={[stylesSupporter.supporterCircleText, selectedCircle === 'Second' && stylesSupporter.supporterCircleTextSelected]}>Second circle</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[stylesSupporter.supporterCircle, selectedCircle === 'Third' && stylesSupporter.supporterCircleSelected]}
                                    onPress={() => handleSelectCircle('Third')}
                                >
                                    <Text style={[stylesSupporter.supporterCircleText, selectedCircle === 'Third' && stylesSupporter.supporterCircleTextSelected]}>Third circle</Text>
                                </TouchableOpacity>
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
                                <TextInput
                                    style={[stylesSupporter.input, stylesSupporter.supporterContactInfoText]}
                                    maxLength={16}
                                    keyboardType="numeric"
                                    value={phone}
                                    placeholderTextColor="#787878"
                                />
                            </View>
                            <View style={stylesSupporter.supporterContactInfo}>
                                <View style={stylesSupporter.supporterContactInfoIconCircle}>
                                    <EmailIcon width={14} height={14} color={'#1C4837'} />
                                </View>
                                <TextInput
                                    style={[stylesSupporter.input, stylesSupporter.supporterContactInfoText]}
                                    maxLength={320}
                                    keyboardType="email-address"
                                    value={email}
                                    placeholderTextColor="#787878"
                                />
                            </View>
                        </View>
                        <View style={stylesSupporter.supporterDelete}>
                            <TouchableOpacity style={stylesSupporter.supporterDeleteLink}>
                                <Text style={stylesSupporter.supporterDeleteLinkText}>Delete Supporter</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal >
    );
}

const stylesSupporter = StyleSheet.create({
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
    circleItemImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleItemImage: {
        height: 30,
        width: 30,
        resizeMode: 'contain'
    },
    circleItemTextWrapper: {
        flexShrink: 1,
        gap: 3,
    },
    circleItemName: {
        color: '#000',
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
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        borderWidth: 0,
        padding: 0,
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
    supporterCircleText: {
        color: '#000',
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
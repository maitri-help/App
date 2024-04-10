import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from '../compontents/Modal';
import styles from '../Styles';
import EditIcon from '../assets/icons/edit-icon.svg';

export default function SupporterCardScreen({ visible, onClose, image, color, firstName, lastName, navigation }) {
    return (
        <Modal visible={visible} onClose={onClose} style={stylesSupporter} modalTopNav
            modalTopNavChildren={
                <View style={stylesSupporter.supportTop}>
                    <View style={stylesSupporter.supportTopLeft}>
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
            <View style={styles.contentContainer}>
            </View>
        </Modal >
    );
}

const stylesSupporter = StyleSheet.create({
    modalContainer: {
        height: '80%',
    },
    supportTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    supportTopLeft: {
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
    }
});
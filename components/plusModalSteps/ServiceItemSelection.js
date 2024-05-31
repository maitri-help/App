import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { modalServices } from '../../data/ModalServices';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';

export default function ServiceItemSelection({ onPress, selectedService, setSelectedService, setCurrentStep, onClose }) {
    const [pressedItem, setPressedItem] = useState(null);

    const handlePressIn = (item) => {
        setPressedItem(item.id);
    };

    const handlePressOut = () => {
        setPressedItem(null);
    };

    const handlePress = (item) => {
        setSelectedService(item);
        if (item.title === 'Custom') {
            setCurrentStep(3);
        } else {
            onPress();
            setCurrentStep(2);
        }
    };

    return (
        <>
            <View style={styles.modalTopNav}>
                <TouchableOpacity onPress={onClose} style={[styles.backLink, styles.backLinkCustom]}>
                    <ArrowLeftIcon width={18} height={18} style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, stylesServices.topBarTitle]}>
                    What Are You Looking For?
                </Text>
            </View>
            <FlatList
                style={stylesServices.servicesListWrapper}
                contentContainerStyle={stylesServices.servicesListContent}
                data={modalServices}
                numColumns={2}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={stylesServices.columnWrapper}>
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => handlePress(item)}
                            onPressIn={() => handlePressIn(item)}
                            onPressOut={handlePressOut}
                            activeOpacity={1}>
                            <View style={
                                [stylesServices.serviceItem,
                                (selectedService.id === item.id || pressedItem === item.id) && stylesServices.serviceItemPressed
                                ]
                            }>
                                <Image source={item.icon} style={stylesServices.serviceIcon} />
                                <Text style={
                                    [stylesServices.serviceText,
                                    (selectedService.id === item.id || pressedItem === item.id) && stylesServices.serviceTextPressed
                                    ]
                                }>
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </>
    )
}

const stylesServices = StyleSheet.create({
    topBarTitle: {
        textAlign: 'center',
        flex: 1,
    },
    servicesListWrapper: {
        flex: 1,
    },
    servicesListContent: {
        justifyContent: 'center',
        gap: 25,
        paddingHorizontal: 16,
    },
    columnWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    serviceItem: {
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1 / 1,
        borderRadius: 70,
        padding: 13,
    },
    serviceItemPressed: {
        backgroundColor: '#E3E3E3',
    },
    serviceIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    serviceText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 13,
        lineHeight: 15,
        textAlign: 'center',
        paddingBottom: 5,
    },
    serviceTextPressed: {
        fontFamily: 'poppins-semibold',
    },
});
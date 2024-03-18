import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Image } from 'react-native';
import testIDs from '../testIDs';

const AgendaItem = (props) => {
    const { item, isLastItemInSection } = props;

    const itemPressed = useCallback(() => {
        Alert.alert(item.title);
    }, []);

    if (isEmpty(item)) {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>No Events Planned</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity onPress={itemPressed} style={[styles.item, isLastItemInSection && styles.lastItem]} testID={testIDs.agenda.ITEM}>
            <View style={[styles.itemIconCircle, { borderColor: item.circleColor }]}>
                <Image source={(item.icon)} style={styles.itemIcon} />
            </View>
            <View style={styles.itemInfos}>
                <View style={styles.itemTitleWrapper}>
                    <Text style={styles.itemTitleText}>{item.title}</Text>
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemNameText}>{item.name}</Text>
                    <View style={styles.itemTimes}>
                        <Text style={styles.itemTimesText}>{item.startTime}</Text>
                        <Text style={styles.itemTimesText}>-</Text>
                        <Text style={styles.itemTimesText}>{item.endTime}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(AgendaItem);


const styles = StyleSheet.create({
    item: {
        padding: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.00,
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 7,
    },
    lastItem: {
        marginBottom: 20,
    },
    itemIconCircle: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderRadius: 25,
    },
    itemIcon: {
        width: 28,
        height: 28,
    },
    itemInfos: {
        flexDirection: 'col',
        gap: 6,
        flexShrink: 1,
    },
    itemDetails: {
        flexDirection: 'col',
        gap: 2,
        flexShrink: 1,
    },
    itemNameText: {
        color: '#747474',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        fontWeight: '400',
        lineHeight: 14,
    },
    itemTimes: {
        flexDirection: 'row',
        gap: 1,
    },
    itemTimesText: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        fontWeight: '400',
        lineHeight: 14,
    },
    itemTitleText: {
        color: '#000',
        fontFamily: 'poppins-medium',
        fontWeight: '500',
        fontSize: 14,
    },
    emptyItem: {
        paddingLeft: 20,
        height: 50,
        justifyContent: 'center',
    },
    emptyItemText: {
        color: '#9F9F9F',
        fontSize: 14
    }
});
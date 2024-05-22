import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import Modal from '../Modal';
import Button from '../Button';

export default function TaskFilterModal({ visible, taskName, onClose, TimeFilterList, setTimeFilterList, TypeFilterList, setTypeFilterList }) {

    const TimeFilters = [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "Weekday",
        "Weekend"
    ]
    const TypeFilters = [
        "Ride",
        "Child Care",
        "Pet Care",
        "Connect",
        "Meal",
        "Errand",
        "Health care",
    ]

    const toggleFilter = (filter, setSelectedFilters) => {
        setSelectedFilters(selectedFilters => {
            const newFilters = selectedFilters.includes(filter)
                ? selectedFilters.filter(f => f !== filter)
                : [...selectedFilters, filter];

            console.log(`Selected filters: ${newFilters.join(', ')}`);
            return newFilters;
        });
    };

    return (
        <Modal
            visible={visible}
            onClose={() => onClose(TimeFilterList, TypeFilterList)}
            style={stylesReview}
        >
            <View style={[styles.modalTopNav, stylesReview.modalTopNav]}>
                <View style={stylesReview.modalTopNavLeft}>
                    <TouchableOpacity onPress={onClose} style={[styles.backLinkInline]}>
                        <ArrowLeftIcon width={18} height={18} style={styles.backLinkIcon} />
                    </TouchableOpacity>
                    <Text style={[stylesReview.field, stylesReview.fieldTask]}>
                        {taskName}
                    </Text>
                </View>

            </View>
            <View style={stylesReview.group}>
                <View style={styles.contentContainer}>
                    <Text style={stylesReview.groupTitle}>Time</Text>
                    <View style={[stylesReview.groupInner]}>
                        {TimeFilters.map(filter => (
                            <Button
                                key={filter}
                                buttonSmall={true}
                                textStyle={{
                                    ...{ fontSize: 14, lineHeight: 18, paddingHorizontal: 2, color: '#000' },
                                    color: TimeFilterList.includes(filter)
                                        ? 'white'
                                        : 'black'
                                }}
                                buttonStyle={{
                                    ...{ width: "auto", height: 30, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 },
                                    backgroundColor: TimeFilterList.includes(filter)
                                        ? '#6AAA5F'
                                        : '#f7f7f7'
                                }}
                                title={filter}
                                onPress={() => toggleFilter(filter, setTimeFilterList)}
                            />
                        ))}
                    </View>
                </View>
            </View>
            <View style={stylesReview.group}>
                <View style={styles.contentContainer}>
                    <Text style={stylesReview.groupTitle}>Type</Text>
                    <View style={[stylesReview.groupInner]}>
                        {TypeFilters.map(filter => (
                            <Button
                                key={filter}
                                buttonSmall={true}
                                textStyle={{
                                    ...{ fontSize: 14, lineHeight: 18, paddingHorizontal: 2, color: '#000' },
                                    color: TypeFilterList.includes(filter)
                                        ? 'white'
                                        : 'black'
                                }}
                                buttonStyle={{
                                    ...{ width: "auto", height: 30, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 },
                                    backgroundColor: TypeFilterList.includes(filter)
                                        ? '#6AAA5F'
                                        : '#f7f7f7'
                                }}
                                title={filter}
                                onPress={() => toggleFilter(filter, setTypeFilterList)}
                            />
                        ))}
                    </View>
                </View>
            </View>

            <View style={[styles.contentContainer, { marginTop: 40 }]}>
                <Button
                    title="Filter"
                    onPress={onClose}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <TouchableOpacity>
                    <Text style={[styles.text, { alignSelf: "center", color: '#55884C', textDecorationLine: 'underline' }]}>Reset</Text>
                </TouchableOpacity>
            </View>

        </Modal>
    )
}

const stylesReview = StyleSheet.create({
    taskNotes: {
        textAlignVertical: 'top',
        flexShrink: 1,
    },
    modalTopNav: {
        justifyContent: 'space-between',
    },
    modalTopNavLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topDescription: {
        marginBottom: 20,
    },
    field: {
        borderWidth: 0,
        padding: 0,
        margin: 0,
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000',
        flexShrink: 1,
    },
    fieldTask: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'poppins-medium',
    },
    fieldLink: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexGrow: 1,
    },
    fielText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#000',
    },
    fieldLinkText: {
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline',
    },
    circles: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        flexShrink: 1,
        flexGrow: 1,
        margin: -3,
    },
    circle: {
        paddingHorizontal: 11,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        margin: 3,
    },
    circleSelected: {
        backgroundColor: '#1C4837',
    },
    circleHidden: {
        display: 'none',
    },
    circleText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
    },
    circleTextSelected: {
        color: '#fff',
    },
    assignee: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    name: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
    },
    group: {
        paddingVertical: 15,
    },
    groupFirst: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
    },
    groupInner: {
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'left',
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 10,
    },
    groupTitle: {
        color: '#9F9F9F',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 18,
        paddingBottom: 10,
    },
});
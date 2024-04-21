import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';

export default function FormFields({ selectedService, modalServiceTasks, currentStep, taskName, onSubmit, onBack, selectedCircle, setSelectedCircle }) {

    useEffect(() => {
        console.log("Selected service:", selectedService);
        if (selectedService && modalServiceTasks[selectedService.id]) {
            console.log("Setting tasks:", modalServiceTasks[selectedService.id]);
        } else {
            console.log("No tasks found");
        }
    }, [selectedService, modalServiceTasks]);

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    const handleSelectCircle = (option) => {
        setSelectedCircle(option);
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesFields.modalTopNav]}>
                <TouchableOpacity onPress={handleBack} style={[styles.backLinkInline]}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, stylesFields.topBarTitle]}>
                    {selectedService.title}
                </Text>
            </View>
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesFields.fieldsList]}>
                    <View style={stylesFields.fieldsListInner}>
                        <View style={[stylesFields.fieldGroup, stylesFields.fieldGroupFirst]}>
                            {taskName === '' || taskName === 'Other' ? (
                                <TextInput
                                    style={[stylesFields.field, stylesFields.fieldTask]}
                                    placeholder="Task name"
                                    placeholderTextColor="#737373"
                                />
                            ) : (
                                <Text style={[stylesFields.field, stylesFields.fieldTask]}>{taskName}</Text>
                            )}
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <TextInput
                                style={stylesFields.field}
                                multiline
                                placeholder="Description"
                                placeholderTextColor="#737373"
                            />
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel}>
                                    Circles
                                </Text>

                                <View style={stylesFields.circleItems}>
                                    {['First', 'Second', 'Third'].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[stylesFields.circleItem, selectedCircle === option && stylesFields.circleItemSelected]}
                                            onPress={() => handleSelectCircle(option)}
                                        >
                                            <Text style={[stylesFields.circleItemText, selectedCircle === option && stylesFields.circleItemTextSelected]}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <Text style={stylesFields.fieldDescription}>
                                Supporter will only see tasks in their circle
                            </Text>
                        </View>
                        <View style={stylesFields.fieldGroup}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel}>
                                    Date & Time
                                </Text>
                                <TouchableOpacity style={stylesFields.fieldLink}>
                                    <Text style={stylesFields.fieldLink}>Fill Time and date</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[stylesFields.fieldGroup, stylesFields.fieldGroupLast]}>
                            <View style={stylesFields.fieldGroupInner}>
                                <Text style={stylesFields.fieldLabel} numberOfLines={1}>
                                    Location
                                </Text>
                                <TextInput
                                    style={stylesFields.field}
                                    multiline
                                    placeholder="Fill the location"
                                    placeholderTextColor="#737373"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.submitButtonContainer, stylesFields.submitButtonContainer]}>
                        <TouchableOpacity onPress={onSubmit} style={styles.submitButton} >
                            <ArrowIcon width={18} height={18} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const stylesFields = StyleSheet.create({
    topBarTitle: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#787878',
    },
    fieldGroup: {
        paddingVertical: 15,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    fieldGroupFirst: {
        borderBottomWidth: 0,
        paddingTop: 0
    },
    fieldGroupLast: {
        borderBottomWidth: 0,
    },
    fieldGroupInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 1,
        gap: 15,
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
    fieldLabel: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'poppins-regular',
        color: '#000',
    },
    fieldTask: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'poppins-medium',
    },
    fieldLink: {
        fontSize: 13,
        lineHeight: 24,
        fontFamily: 'poppins-regular',
        color: '#737373',
        textDecorationLine: 'underline',
    },
    fieldDescription: {
        color: '#737373',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'poppins-regular',
        textAlign: 'center',
        paddingTop: 20,
    },
    submitButtonContainer: {
        paddingTop: 10,
    },
    circleItems: {
        flexDirection: 'row',
        gap: 8,
    },
    circleItem: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
    },
    circleItemSelected: {
        backgroundColor: '#1C4837',
    },
    circleItemText: {
        color: '#000',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16,
    },
    circleItemTextSelected: {
        color: '#fff',
    },
});
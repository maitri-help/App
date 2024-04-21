import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import styles from '../../Styles';
import ArrowLeftIcon from '../../assets/icons/arrow-left-icon.svg';
import ArrowIcon from '../../assets/icons/arrow-icon.svg';

export default function DateTime({ currentStep, setCurrentStep, taskName, setTaskName, onSubmit, onBack }) {
    console.log("Task Name in DateTime:", taskName);

    const handleBack = () => {
        if (currentStep > 1) {
            onBack();
        }
    };

    return (
        <>
            <View style={[styles.modalTopNav, stylesDate.modalTopNav]}>
                <TouchableOpacity onPress={handleBack} style={[styles.backLinkInline]}>
                    <ArrowLeftIcon style={styles.backLinkIcon} />
                </TouchableOpacity>
                <Text style={[styles.topBarTitle, stylesDate.topBarTitle]}>
                    {taskName}
                </Text>
            </View>
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={[styles.contentContainer, stylesDate.fieldsList]}>
                    <View>
                        <Text>
                            Date
                        </Text>
                    </View>
                    <View style={[styles.submitButtonContainer, stylesDate.submitButtonContainer]}>
                        <TouchableOpacity onPress={onSubmit} style={styles.submitButton} >
                            <ArrowIcon width={18} height={18} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const stylesDate = StyleSheet.create({
    topBarTitle: {
        fontSize: 16,
        fontFamily: 'poppins-regular',
        color: '#787878',
    },
});
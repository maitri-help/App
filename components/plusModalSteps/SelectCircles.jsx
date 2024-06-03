import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { circles } from '../../constants/variables';
import { getSelectedCircles } from '../../helpers/task.helpers';

const SelectCircles = ({ task, setTask }) => {
    const handleSelectOption = (option) => {
        const updatedCircles = getSelectedCircles(task, option);
        setTask((prev) => ({ ...prev, circles: updatedCircles }));
    };

    return (
        <View style={stylesFields.fieldGroup}>
            <View style={stylesFields.fieldGroupInner}>
                <Text style={stylesFields.fieldLabel}>Circles</Text>

                <View style={stylesFields.circleItems}>
                    {circles.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                stylesFields.circleItem,
                                task?.circles?.includes(option) &&
                                    stylesFields.circleItemSelected
                            ]}
                            onPress={() => handleSelectOption(option)}
                        >
                            <Text
                                style={[
                                    stylesFields.circleItemText,
                                    task?.circles?.includes(option) &&
                                        stylesFields.circleItemTextSelected
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <Text style={stylesFields.fieldDescription}>
                Supporter will only see tasks in their circle
            </Text>
        </View>
    );
};

export default SelectCircles;

const stylesFields = StyleSheet.create({
    fieldGroup: {
        paddingVertical: 15,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1
    },
    fieldGroupInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 1,
        flexWrap: 'wrap',
        gap: 10
    },
    fieldLabel: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'poppins-regular',
        color: '#000'
    },
    fieldDescription: {
        color: '#737373',
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'poppins-regular',
        textAlign: 'center',
        paddingTop: 20
    },
    circleItems: {
        flexDirection: 'row',
        gap: 6
    },
    circleItem: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#1C4837',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center'
    },
    circleItemSelected: {
        backgroundColor: '#1C4837'
    },
    circleItemText: {
        color: '#1C4837',
        fontFamily: 'poppins-regular',
        fontSize: 12,
        lineHeight: 16
    },
    circleItemTextSelected: {
        color: '#fff'
    }
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReviewForm({ formData, onSubmit }) {
    return (
        <View>
            <Text>Task Name: {formData.taskName}</Text>
            <Text>Description: {formData.description}</Text>
            {/* Display other form data */}
            <TouchableOpacity onPress={onSubmit}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

});
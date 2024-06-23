import React from 'react';
import styles from '../../Styles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const Fab = ({ pressHandler, icon }) => {
    return (
        <View style={stylesFab.floatingButtonWrapper}>
            <TouchableOpacity
                onPress={pressHandler}
                style={styles.floatingButton}
                activeOpacity={1}
            >
                {icon}
            </TouchableOpacity>
        </View>
    );
};

export default Fab;

const stylesFab = StyleSheet.create({
    floatingButtonWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 5
    }
});

import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TaskItem from '../TaskItem';

const AgendaItem = (props) => {
    const { item, setTaskModalVisible, handleTaskItemClick } = props;

    if (isEmpty(item)) {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>
                    No Events Planned Today
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.item}>
            <TaskItem
                task={item}
                taskModal={() => setTaskModalVisible(true)}
                onTaskItemClick={handleTaskItemClick}
                isCheckbox
            />
        </View>
    );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
    item: {
        marginVertical: 20,
        paddingHorizontal: 25
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52,
        justifyContent: 'center'
    },
    emptyItemText: {
        color: 'lightgrey',
        fontSize: 14
    }
});

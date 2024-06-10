import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';
import CheckIcon from '../assets/icons/check-medium-icon.svg';
import { getAccessToken } from '../authStorage';
import { updateTask } from '../hooks/api';
import { useToast } from 'react-native-toast-notifications';
import {
    calcIsDue,
    findIcon,
    sortTasksByStartDate
} from '../helpers/task.helpers';
import { formatTaskItemDate } from '../helpers/date';
import { useTask } from '../context/TaskContext';

export default function TaskItem({
    task,
    taskModal,
    onTaskItemClick,
    isCheckbox
}) {
    const isChecked = task.status === 'done' ? true : false;
    const toast = useToast();
    const { setTasks } = useTask();

    const handleToggleCheckbox = async () => {
        const newStatus = isChecked ? 'undone' : 'done';
        const updatedTask = { status: newStatus };

        try {
            const accessToken = await getAccessToken();
            const res = await updateTask(task.taskId, updatedTask, accessToken);

            setTasks((prev) => {
                //remove the updated task from the list
                const filteredTasks = prev.filter(
                    (task) => task.taskId !== res?.data.taskId
                );
                const newTasks = sortTasksByStartDate([
                    res?.data,
                    ...filteredTasks
                ]);
                return newTasks;
            });

            toast.show(`Task is set to: ${newStatus}`, { type: 'success' });
        } catch (error) {
            toast.show('Error updating task status', { type: 'error' });
            console.error('Error updating task:', error);
        }
    };

    const handleClick = () => {
        onTaskItemClick(task);
        taskModal();
    };

    const isDue = calcIsDue(task);

    const icon = findIcon(task);

    const isPersonal =
        task.circles &&
        task.circles.length === 1 &&
        task.circles[0].circleLevel === 'Personal';

    return (
        <TouchableOpacity
            style={[styles.container, isChecked && styles.greyedOut]}
            activeOpacity={0.7}
            onPress={handleClick}
        >
            <View style={styles.wrapper}>
                <View
                    style={[
                        styles.emojiWrapper,
                        task.assignee
                            ? {
                                  borderColor: task.assignee.color
                                      ? task.assignee.color
                                      : '#1C4837'
                              }
                            : ''
                    ]}
                >
                    {isPersonal ? (
                        icon ? (
                            <Image source={icon} style={styles.emojiIMG} />
                        ) : (
                            <Text style={styles.emoji}>👤</Text>
                        )
                    ) : (
                        <Text style={styles.emoji}>
                            {task.assignee ? task.assignee.emoji : ''}
                        </Text>
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.title,
                            isChecked ? styles.textStriked : '',
                            isChecked && styles.greyedOut,
                            isDue && styles.dueText
                        ]}
                    >
                        {task.title} {`${task.status}`} {`${isChecked}`}
                    </Text>
                    {isPersonal ? (
                        <Text
                            style={[
                                styles.assignee,
                                isChecked ? styles.textStriked : '',
                                isChecked && styles.greyedOut,
                                isDue && styles.dueText
                            ]}
                        >
                            Just Me
                        </Text>
                    ) : (
                        task.assignee && (
                            <Text
                                style={[
                                    styles.assignee,
                                    isChecked ? styles.textStriked : '',
                                    isChecked && styles.greyedOut,
                                    isDue && styles.dueText
                                ]}
                            >
                                {`${task.assignee.firstName} ${task.assignee.lastName}`}
                            </Text>
                        )
                    )}
                    {task.startDate && task.endDate && (
                        <Text
                            style={[
                                styles.time,
                                isChecked ? styles.textStriked : '',
                                isChecked && styles.greyedOut,
                                isDue && styles.dueText
                            ]}
                        >
                            {formatTaskItemDate(task)}
                        </Text>
                    )}
                </View>
            </View>

            {isCheckbox && (
                <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={handleToggleCheckbox}
                >
                    <View
                        style={
                            isChecked ? styles.checkboxChecked : styles.checkbox
                        }
                    >
                        {isChecked && (
                            <View style={styles.checkboxInner}>
                                <CheckIcon
                                    width={13}
                                    height={13}
                                    style={styles.checkboxIcon}
                                />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.09,
        shadowRadius: 8.0,
        elevation: 12
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        flexShrink: 1
    },
    emojiWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1C4837',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emoji: {
        fontSize: Platform.OS === 'android' ? 24 : 28,
        textAlign: 'center'
    },
    emojiIMG: {
        width: 26,
        height: 26,
        resizeMode: 'contain'
    },
    textContainer: {
        flexShrink: 1,
        gap: 3
    },
    title: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'poppins-regular',
        lineHeight: 16,
        marginBottom: 2
    },
    assignee: {
        color: '#747474',
        fontSize: 12,
        fontFamily: 'poppins-regular',
        lineHeight: 14
    },
    time: {
        color: '#9F9F9F',
        fontSize: 12,
        fontFamily: 'poppins-light',
        lineHeight: 14,
        flexShrink: 1
    },
    textStriked: {
        textDecorationLine: 'line-through'
    },
    checkboxWrapper: {
        height: '100%',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },
    checkbox: {
        borderWidth: 1,
        borderColor: '#000',
        width: 18,
        height: 18,
        borderRadius: 9,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxChecked: {
        borderColor: '#6AAA5F'
    },
    checkboxInner: {
        backgroundColor: '#6AAA5F',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10
    },
    checkboxIcon: {
        resizeMode: 'contain',
        color: '#fff'
    },
    greyedOut: {
        color: '#B0B0B0'
    },
    dueText: {
        color: '#FF5454'
    }
});

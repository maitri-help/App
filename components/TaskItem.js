import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image } from 'react-native';
import CheckIcon from '../assets/icons/check-medium-icon.svg';
import { getAccessToken } from '../authStorage';
import { updateTask } from '../hooks/api';
import { useToast } from 'react-native-toast-notifications';
import { modalServices } from '../data/ModalServices';

export default function TaskItem({ task, taskModal, onTaskItemClick, isCheckbox, onTaskStatusChange }) {
  const [isChecked, setIsChecked] = useState(task.status === 'done');
  const toast = useToast();

  useEffect(() => {
    setIsChecked(task.status === 'done');
  }, [task.status]);

  const handleToggleCheckbox = async () => {
    const newStatus = isChecked ? 'undone' : 'done';
    const updatedTask = { status: newStatus };

    try {
      const accessToken = await getAccessToken();
      await updateTask(task.taskId, updatedTask, accessToken);
      setIsChecked(!isChecked);
      toast.show(`Task is set to: ${newStatus}`, { type: 'success' });
      onTaskStatusChange();  // Notify parent component
    } catch (error) {
      toast.show('Error updating task status', { type: 'error' });
      console.error('Error updating task:', error);
    }
  };

  const formatDateTime = (task) => {
    const formattedStartDateTime = formatDate(task.startDateTime);
    const formattedEndDateTime = formatDate(task.endDateTime);
    return `${formattedStartDateTime} - ${formattedEndDateTime}`;
  };

  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const handleClick = () => {
    onTaskItemClick(task);
    taskModal();
  };

  const findIcon = () => {
    const service = modalServices.find(service => service.title === task.category);
    return service ? service.icon : null;
  };

  const isDue = new Date(task.endDateTime) < new Date() && task.status === 'undone';
  const icon = findIcon();
  const isPersonal = task.circles && task.circles.length === 1 && task.circles[0].circleLevel === 'Personal';

  return (
    <TouchableOpacity style={[styles.container, isChecked && styles.greyedOut]} activeOpacity={0.7} onPress={handleClick}>
      <View style={styles.wrapper}>
        <View style={[styles.emojiWrapper, task.assignee ? { borderColor: task.assignee.color ? task.assignee.color : '#1C4837' } : '']}>
          {isPersonal ? (
            icon ? (
              <Image source={icon} style={styles.emojiIMG} />
            ) : (
              <Text style={styles.emoji}>👤</Text>
            )
          ) : (
            <Text style={styles.emoji}>{task.assignee ? task.assignee.emoji : ''}</Text>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, isChecked ? styles.textStriked : '', isChecked && styles.greyedOut, isDue && styles.dueText]}>{task.title}</Text>
          {isPersonal ? (
            <Text style={[styles.assignee, isChecked ? styles.textStriked : '', isChecked && styles.greyedOut, isDue && styles.dueText]}>Just Me</Text>
          ) : (
            task.assignee && (
              <Text style={[styles.assignee, isChecked ? styles.textStriked : '', isChecked && styles.greyedOut, isDue && styles.dueText]}>
                {`${task.assignee.firstName} ${task.assignee.lastName}`}
              </Text>
            )
          )}
          {(task.startDateTime && task.endDateTime) && <Text style={[styles.time, isChecked ? styles.textStriked : '', isChecked && styles.greyedOut, isDue && styles.dueText]}>
            {formatDateTime(task)}
          </Text>}
        </View>
      </View>

      {isCheckbox &&
        <TouchableOpacity style={styles.checkboxWrapper} onPress={handleToggleCheckbox}>
          <View style={isChecked ? styles.checkboxChecked : styles.checkbox}>
            {isChecked &&
              <View style={styles.checkboxInner}>
                <CheckIcon width={13} height={13} style={styles.checkboxIcon} />
              </View>
            }
          </View>
        </TouchableOpacity>
      }
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
    shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8.00,
    elevation: 12,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 15,
    flexShrink: 1,
  },
  emojiWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1C4837',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: (Platform.OS === 'android') ? 24 : 28,
    textAlign: 'center',
  },
  emojiIMG: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  textContainer: {
    flexShrink: 1,
    gap: 3,
  },
  title: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'poppins-regular',
    lineHeight: 16,
    marginBottom: 2,
  },
  assignee: {
    color: '#747474',
    fontSize: 12,
    fontFamily: 'poppins-regular',
    lineHeight: 14,
  },
  time: {
    color: '#9F9F9F',
    fontSize: 12,
    fontFamily: 'poppins-light',
    lineHeight: 14,
    flexShrink: 1,
  },
  textStriked: {
    textDecorationLine: 'line-through',
  },
  checkboxWrapper: {
    height: '100%',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#000',
    width: 18,
    height: 18,
    borderRadius: 9,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#6AAA5F',
  },
  checkboxInner: {
    backgroundColor: '#6AAA5F',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  checkboxIcon: {
    resizeMode: 'contain',
    color: '#fff',
  },
  greyedOut: {
    color: '#B0B0B0',
  },
  dueText: {
    color: '#FF5454',
  }
});

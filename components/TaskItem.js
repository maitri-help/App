import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import CheckIcon from '../assets/icons/check-medium-icon.svg';

export default function TaskItem({ task, taskModal }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleCheckbox = () => {
    setIsChecked(prevState => !prevState);
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

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={taskModal}>
      <View style={styles.wrapper}>
        <View style={[styles.emojiWrapper, task.color ? {borderColor: task.color} : '']}>
          {task.emoji && <Text style={styles.emoji}>
            {task.emoji}
          </Text>}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, isChecked ? styles.textStriked : '']}>{task.title}</Text>
          {task.firstName && task.lastName && <Text style={[styles.assignee, isChecked ? styles.textStriked : '']}>
            {task.firstName} {task.lastName}
          </Text>}
          {(task.startDateTime && task.endDateTime) && <Text style={[styles.time, isChecked ? styles.textStriked : '']}>
            {formatDateTime(task)}
          </Text>}
        </View>
      </View>

      <TouchableOpacity style={styles.checkboxWrapper} onPress={handleToggleCheckbox}>
        <View style={[isChecked ? styles.checkboxChecked : styles.checkbox]}>
          {isChecked &&
            <View style={styles.checkboxInner}>
              <CheckIcon style={styles.checkboxIcon} />
            </View>
          }
        </View>
      </TouchableOpacity>
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
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  checkboxIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    color: '#fff',
  }
});

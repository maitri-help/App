import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import CheckIcon from '../assets/icons/check-medium-icon.svg';

export default function AppointmentItem({ appointment }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleCheckbox = () => {
    setIsChecked(prevState => !prevState);
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={handleToggleCheckbox}>
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
          <Image source={appointment.image} style={styles.image} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, isChecked ? styles.textStriked : '']}>{appointment.title}</Text>
          {appointment.assignee && <Text style={[styles.assignee, isChecked ? styles.textStriked : '']}>{appointment.assignee}</Text>}
          <Text style={[styles.time, isChecked ? styles.textStriked : '']}>{appointment.time}</Text>
        </View>
      </View>

      <View style={[isChecked ? styles.checkboxChecked : styles.checkbox]}>
        {isChecked &&
          <View style={styles.checkboxInner}>
            <CheckIcon style={styles.checkboxIcon} />
          </View>
        }
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    gap: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 8.00,
    elevation: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1C4837',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
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
  },
  textStriked: {
    textDecorationLine: 'line-through',
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

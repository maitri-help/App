import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = ({ onPress, title, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1C4837',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#1C4837',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 400,
    fontFamily: 'poppins-regular',
  },
});

export default AppButton;
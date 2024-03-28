import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = ({ onPress, title, buttonStyle, textStyle, buttonSmall }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[buttonSmall ? styles.buttonSmall : styles.button, buttonStyle]}>
      <Text style={[buttonSmall ? styles.buttonSmallText : styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1C4837',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 100,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'poppins-regular',
  },
  buttonSmall: {
    backgroundColor: '#1C4837',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  buttonSmallText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily: 'poppins-medium',
  }
});

export default AppButton;
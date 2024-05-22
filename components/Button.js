import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import CloseIcon from '../assets/icons/close-icon-small.svg';

const AppButton = ({ onPress, title, buttonStyle, textStyle, buttonSmall, closeIcon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[buttonSmall ? styles.buttonSmall : styles.button, buttonStyle]}>
      <Text style={[buttonSmall ? styles.buttonSmallText : styles.text, textStyle]}>{title}</Text>
      {closeIcon &&
        <View style={styles.closeIconWrapper}>
          <CloseIcon width={10} height={10} style={styles.closeIcon} />
        </View>
      }
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
    fontFamily: 'poppins-regular',
  },
  buttonSmall: {
    backgroundColor: '#1C4837',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonSmallText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'poppins-medium',
  },
  closeIconWrapper: {
    backgroundColor: '#6AAA5F',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 6,
  },
  closeIcon: {
    color: '#fff',
  }
});

export default AppButton;
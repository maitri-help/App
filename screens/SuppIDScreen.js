import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import AppButton from '../compontents/Button';
import ArrowBackIcon from '../assets/icons/arrow-left-icon.svg';

const SuppIDScreen = () => {

  const firstName = '[FIRSTNAME]';
  const leadName = '[LEADNAME]';
  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View style={styles.contentContainer}>
          <View style={stylesSuppID.topBar}>
            <TouchableOpacity onPress={() => console.log('Back')}>
              <ArrowBackIcon width={19} height={19} color={'#000'} />
            </TouchableOpacity>
          </View>
          <View style={stylesSuppID.textContainer}>
            <Text style={[styles.title, stylesSuppID.headerText]}>Hey <Text style={{fontWeight: 'bold'}}>{firstName}</Text></Text>
            <Text style={[styles.text, stylesSuppID.paragraph]}>Welcome to Maitri!</Text>
            <Text style={[styles.text, stylesSuppID.paragraph]}>Let's start by customizing your persona. This is how you'll show up on <Text style={{fontWeight: 'bold'}}>{leadName}</Text>'s support circle.</Text>
            <Text style={[styles.text, stylesSuppID.paragraph]}>Choose a color and emoji that best represent you.</Text>
          </View>
          <View style={[styles.buttonContainer, stylesSuppID.buttonContainer]}>
            <AppButton
              title="Color"
              onPress={() => console.log('Color button pressed!')}
              buttonStyle={stylesSuppID.customButton}
              textStyle={stylesSuppID.customButtonText}
            />
            <AppButton
              title="Emoji"
              onPress={() => console.log('Emoji button pressed!')}
              buttonStyle={stylesSuppID.customButton}
              textStyle={stylesSuppID.customButtonText}
            />
          </View>
          <View style={stylesSuppID.nextButtonContainer}>
            <AppButton
              title="Next"
              onPress={() => console.log('Next button pressed!')}
              buttonStyle={[styles.buttonContainer]}
            />
      </View>
        </View>
    </SafeAreaView>
  );
};

const stylesSuppID = StyleSheet.create({
  topBar: {
    marginTop: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  headerText: {
    marginBottom: 40, 
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 60, 
  },
  button: {
    backgroundColor: '#fff'
  },
  nextButtonContainer: {
    marginTop: 130,
  },
  customButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#fff',
    shadowColor: "#000",
    elevation: 5,
    marginBottom: 20,
  },
  customButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default SuppIDScreen;
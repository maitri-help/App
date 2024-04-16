import React from 'react';
import { View, StyleSheet, Image, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import AppButton from '../components/Button';
import CloseIcon from '../assets/icons/close-icon.svg';

const SuppExistingScreen = () => {

  const firstName = 'FIRSTNAME';
  const lastName = 'LASTNAME';

  return (
    <SafeAreaView style={[styles.safeArea, stylesSuppGN.safeArea]}>
      <View style={styles.contentContainer}>
        <View style={stylesSuppGN.innerContainer}>
          <View style={stylesSuppGN.topBar}>
            <TouchableOpacity style={stylesSuppGN.closeIconWrapper} onPress={() => console.log('Close')}>
              <CloseIcon width={19} height={19} color={'#000'} />
            </TouchableOpacity>
          </View>
          <Image source={require('../assets/img/star-illustration.png')} style={stylesSuppGN.star1} />
          <Image source={require('../assets/img/star-illustration.png')} style={stylesSuppGN.star2} />
          <Image source={require('../assets/img/star-illustration.png')} style={stylesSuppGN.star3} />
          <Image source={require('../assets/img/star-illustration.png')} style={stylesSuppGN.star4} />
          <View style={stylesSuppGN.headerWrapper}>
            <Text style={stylesSuppGN.title}>Great News!</Text>
          </View>
          <View style={stylesSuppGN.bodyWrapper}>
            <Text style={stylesSuppGN.text}>
              <Text style={stylesSuppGN.boldText}>{`${firstName} ${lastName}`}</Text>
              {" added you to their support circle\n\n"}
              {"Let's get you set up and start spreading the love"}
            </Text>
          </View>
          <View style={stylesSuppGN.illustrationWrapper}>
            <Image source={require('../assets/img/mimi-and-friend-illustration-min.png')}
              style={stylesSuppGN.illustration}
            />
          </View>
          <View style={stylesSuppGN.buttonContainer}>
            <AppButton
              title="I'm Ready!"
              onPress={() => console.log('Button pressed!')}
              buttonStyle={stylesSuppGN.button}
            />
          </View>
          <TouchableOpacity style={stylesSuppGN.notYouTextWrapper} onPress={() => console.log('Back')}>
            <Text style={stylesSuppGN.notYouText}>Not You? Click Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const stylesSuppGN = StyleSheet.create({
  safeArea: {
    backgroundColor: '#E5F5E3',
  },
  innerContainer: {
    position: 'relative',
    flex: 1,
  },
  illustrationWrapper: {
    position: 'absolute',
    top: 358,
    alignSelf: 'center',
  },
  illustration: {
    resizeMode: 'contain',
    width: 277,
    height: 178,
  },
  headerWrapper: {
    position: 'absolute',
    top: 154,
    alignSelf: 'center',
  },
  bodyWrapper: {
    position: 'absolute',
    top: 223,
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: 'poppins-medium',
    color: '#55884C'
  },
  text: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'poppins-regular',
    paddingHorizontal: 60, // add vertical padding
    textAlign: 'center', // align text to center
  },
  buttonContainer: {
    position: 'absolute',
    top: 591,
    width: '100%',
    paddingHorizontal: 15,
  },
  boldText: {
    fontFamily: 'poppins-bold',
  },
  notYouTextWrapper: {
    position: 'absolute',
    top: 750,
    alignSelf: 'center',
  },
  notYouText: {
    color: '#000000',
    fontSize: 12,
    fontFamily: 'poppins-regular',
    textDecorationLine: 'underline',
  },
  star1: {
    position: 'absolute',
    left: 240,
    top: 93,
    width: 22, // adjust as needed
    height: 22, // adjust as needed
    transform: [{ rotate: '0deg' }],
  },
  star2: {
    position: 'absolute',
    left: 11,
    top: 186,
    width: 28, // adjust as needed
    height: 28, // adjust as needed
    transform: [{ rotate: '-21deg' }],
  },
  star3: {
    position: 'absolute',
    left: 305,
    top: 349,
    width: 30, // adjust as needed
    height: 30, // adjust as needed
    transform: [{ rotate: '-22deg' }],
  },
  star4: {
    position: 'absolute',
    left: -20,
    top: 555,
    width: 50, // adjust as needed
    height: 50, // adjust as needed
    transform: [{ rotate: '85deg' }],
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
  },
});

export default SuppExistingScreen;

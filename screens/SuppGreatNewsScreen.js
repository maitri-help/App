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
          <View style={stylesSuppGN.topBar}>
            <TouchableOpacity onPress={() => console.log('Close')}>
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
            />
          </View>
        </View>
    </SafeAreaView>
  );
};

const stylesSuppGN = StyleSheet.create({
  safeArea: {
    backgroundColor: '#E5F5E3',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  illustrationWrapper: {
    paddingTop: 40,
    alignSelf: 'center',
  },
  illustration: {
    resizeMode: 'contain',
    width: 277,
    height: 178,
  },
  headerWrapper: {
    paddingTop: 60,
    alignSelf: 'center',
  },
  bodyWrapper: {
    paddingTop: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    fontFamily: 'poppins-medium',
  },
  text: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'poppins-regular',
    paddingHorizontal: 60, 
    textAlign: 'center', 
  },
  boldText: {
    fontFamily: 'poppins-bold',
  },
  buttonContainer:{
    paddingTop: 80,
    width: '100%',
    paddingHorizontal: 15,
  },
  star1: {
    position: 'absolute',
    left: 240,
    top: 43,
    width: 22,
    height: 22,
    transform: [{ rotate: '0deg' }],
  },
  star2: {
    position: 'absolute',
    left: 11,
    top: 136,
    width: 28, 
    height: 28, 
    transform: [{ rotate: '-21deg' }],
  },
  star3: {
    position: 'absolute',
    left: 305,
    top: 299,
    width: 30,
    height: 30,
    transform: [{ rotate: '-22deg' }],
  },
  star4: {
    position: 'absolute',
    left: -20,
    top: 465,
    width: 50,
    height: 50,
    transform: [{ rotate: '85deg' }],
  }
});

export default SuppExistingScreen;

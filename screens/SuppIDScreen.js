import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Animated, Platform } from 'react-native'; import styles from '../Styles';
import AppButton from '../components/Button';
import ArrowBackIcon from '../assets/icons/arrow-left-icon.svg';
import ColorPickerModal from '../components/ColorPickerModal';
import EmojiPickerModal from '../components/EmojiPickerModal';
import { checkAuthentication, clearUserData, clearAccessToken, getLeadUserData } from '../authStorage';

export default function SuppIDScreen({ navigation }) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [leadFirstName, setLeadFirstName] = useState('Lead');
  const [leadLastName, setLeadLastName] = useState('name');

  const [emojiModalVisible, setEmojiModalVisible] = useState(false);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await checkAuthentication();
        if (userData) {
          console.log('User data:', userData);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        clearUserData();
        clearAccessToken();
        navigation.navigate('Login');
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLeadUserData = async () => {
      try {
        const userData = await getLeadUserData();
        setLeadFirstName(userData[0].firstName);
        setLeadLastName(userData[0].lastName);
      } catch (error) {
        console.error('Error fetching lead user data:', error);
      }
    };

    fetchLeadUserData();
  }, []);

  const handleColorSelect = (color) => {
    console.log('Color selected:', color);
    setSelectedColor(color);
  };

  const handleEmojiSelect = (emoji) => {
    console.log('Emoji selected:', emoji)
    setSelectedEmoji(emoji);
  };

  useEffect(() => {
    if (colorModalVisible || emojiModalVisible) {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [{ colorModalVisible, emojiModalVisible }]);

  return (
    <>
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.contentContainer}>
          <View style={stylesSuppID.topBar}>
            <TouchableOpacity onPress={() => navigation.navigate('SuppGreatNews')}>
              <ArrowBackIcon width={19} height={19} color={'#000'} />
            </TouchableOpacity>
          </View>
          <View style={stylesSuppID.textContainer}>
            <Text style={[styles.title, stylesSuppID.headerText]}>Hey <Text>{firstName}</Text></Text>
            <Text style={[styles.text, { paddingBottom: 20, fontSize: 16, }, stylesSuppID.paragraph]}>Welcome to Maitri!</Text>
            <Text style={[styles.text, stylesSuppID.paragraph]}>Let's start by customizing your persona. This is how you'll show up on <Text style={{ fontFamily: 'poppins-bold' }}>{leadFirstName} {leadLastName}</Text>'s support circle.</Text>
            <Text style={[styles.text, stylesSuppID.paragraph]}>Choose a color and emoji that best represent you.</Text>
          </View>
          <View style={[styles.buttonContainer, stylesSuppID.buttonContainer]}>
            <AppButton
              title="Color"
              onPress={() => setColorModalVisible(true)}
              buttonStyle={stylesSuppID.customButton}
              textStyle={stylesSuppID.customButtonText}
              activeOpacity={1}
            />

            <ColorPickerModal
              visible={colorModalVisible}
              onClose={() => setColorModalVisible(false)}
              onColorSelect={handleColorSelect}
              selectedColor={selectedColor}
            />
            <AppButton
              title="Emoji"
              onPress={() => setEmojiModalVisible(true)}
              buttonStyle={stylesSuppID.customButton}
              textStyle={stylesSuppID.customButtonText}
            />
            <EmojiPickerModal
              visible={emojiModalVisible}
              onClose={() => setEmojiModalVisible(false)}
              onEmojiSelect={handleEmojiSelect}
              selectedEmoji={selectedEmoji}
              selectedColor={selectedColor}
            />
          </View>

          <View style={stylesSuppID.nextButtonContainer}>
            <AppButton
              title="Next"
              onPress={() => navigation.navigate('MainSupporter')}
              buttonStyle={[styles.buttonContainer]}
            />

          </View>
        </View>
      </SafeAreaView>

      {(colorModalVisible) && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      )}
      {(emojiModalVisible) && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      )}
    </>

  );
}

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
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  customButtonText: {
    fontSize: 16,
    color: '#000',
  },
});
import React from 'react';
import Modal from '../../components/Modal';
import styles from '../../Styles';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import { useUser } from '../../context/UserContext';
import { updateLocation } from '../../hooks/api';
import { useToast } from 'react-native-toast-notifications';
import { checkAuthentication } from '../../authStorage';

export default function EditLocationModal({ visible, onClose, location }) {
  const { userData, setUserData } = useUser();
  const toast = useToast();

  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [locationCoordinates, setLocationCoordinates] = React.useState(null);
  const [locationDescription, setLocationDescription] = React.useState(null);
  const [locationDescriptionError, setLocationDescriptionError] = React.useState('');

  const [address, setAddress] = React.useState(null);

  React.useEffect(() => {
    const getAddressFromCoordinates = () => {
      if (location && location.location) {
        const [latitude, longitude] = location.location
          .split(',')
          .map(parseFloat);
        Geocoder.from({ latitude, longitude })
          .then((json) => {
            const address = json.results[0].formatted_address;
            setAddress(address);
          })
          .catch((error) => console.warn(error));
      }
    };

    if (location) {
      setSelectedLocation(location.userLocationId);
      setLocationCoordinates(location.location);
      setLocationDescription(location.description);

      getAddressFromCoordinates();
    }
  }, [location]);

  const handleEdit = async () => {
    if (!locationDescription) {
      setLocationDescriptionError('Location name is required');
      return;
    }
    
    if (!selectedLocation || !locationCoordinates) {
      return;
    }

    try {
      const accessToken = userData.accessToken;
      const response = await updateLocation(
        selectedLocation, 
        { description: locationDescription, location: locationCoordinates },
        accessToken
      ).catch((error) => {
        if (error.response?.data?.message) {
          toast.show(error.response.data.message, { type: 'error' });
        }
      });

      if (response) {
        if (response.status && response.status === 200) {
          toast.show('Location updated successfully', { type: 'success' });

          const newUserData = await checkAuthentication();
          setUserData(newUserData);
          onClose();
        }
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }

  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      modalTopNav={true}
      modalTopNavChildren={
        <Text style={styles.topBarTitle}>
          Edit Location
        </Text>
      }
      style={stylesProfile}
    >
      <View style={[styles.contentContainer, stylesProfile.container]}>
        <View style={stylesProfile.inputContainer}>
          <Text style={stylesProfile.inputLabel}>Name</Text>
          <TextInput 
            style={[styles.input, stylesProfile.innerModalInput, locationDescriptionError && { borderColor: 'red' }]}
            value={locationDescription}
            placeholder="Enter location name"
            onChange={(e) => {
              setLocationDescription(e.nativeEvent.text);
              setLocationDescriptionError('');
            }}
          />
          <Text style={stylesProfile.innerModalInputError}>{locationDescriptionError}</Text>
        </View>
        <View style={stylesProfile.inputContainer}>
          <Text style={stylesProfile.inputLabel}>Location</Text>
          <Text style={stylesProfile.inputValue}>{address}</Text>
        </View>
        <View style={stylesProfile.buttons}>
          <Pressable style={[stylesProfile.button, stylesProfile.editButton]} onPress={handleEdit}>
            <Text style={[stylesProfile.buttonText]}>Edit</Text>
          </Pressable>
          <Pressable style={[stylesProfile.button, stylesProfile.cancelButton]} onPress={onClose}>
            <Text style={[stylesProfile.buttonText]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal >
  );
};

const stylesProfile = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
  container: {
    flex: 1,
  },
  buttons: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 295,
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#4D4D4D',
    borderRadius: 50,
    backgroundColor: '#E5F5E3'
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'poppins-medium',
    lineHeight: 18,
    color: '#737373'
  },
  cancelButton: {
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  innerModalInput: {
    height: 30,
    marginVertical: 10,
    minWidth: 200,
    paddingVertical: 0
  },
  innerModalInputError: {
    color: '#FF0000',
    fontSize: 12,
    fontFamily: 'poppins-regular',
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'poppins-medium',
    marginBottom: 5
  },
  inputValue: {
    fontSize: 14,
    fontFamily: 'poppins-regular',
    marginBottom: 20
  },
});
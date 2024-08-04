import * as React from 'react';
import { Animated, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useUser } from "../context/UserContext";
import styles from "../Styles";
import ArrowBackIcon from '../assets/icons/arrow-left-icon.svg';
import EditIcon from '../assets/icons/edit-icon.svg';
import TrashIcon from '../assets/icons/trash-icon.svg';
import Geocoder from 'react-native-geocoding';
import { GEOLOCATION_API_KEY } from '../constants/config';
import { checkAuthentication } from '../authStorage';
import { useToast } from 'react-native-toast-notifications';
import { deleteLocation } from '../hooks/api';
import EditLocationModal from '../components/profileModals/EditLocationModal';

Geocoder.init(GEOLOCATION_API_KEY);

export default function ManageLocationsScreen({ navigation }) {
  const toast = useToast();
  const { userData, setUserData } = useUser();
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(null);

  React.useEffect(() => {
    if (editModalVisible) {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [editModalVisible]);

  const handleEditPress = (location) => {
    setSelectedLocation(location);
    setEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setSelectedLocation(null);
    setEditModalVisible(false);
  };

  const handleDeletePress = (location) => {
    setSelectedLocation(location);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (!userData || !userData.accessToken) {
        toast.show('You are not authenticated. Please log in again.', { type: 'error' });
        return;
      }

      if (!selectedLocation) {
        toast.show('No location selected to delete.', { type: 'error' });
        return;
      }

      const accessToken = userData.accessToken;
      const response = await deleteLocation(selectedLocation, accessToken)
        .catch((error) => {
          if (error.response?.data?.message) {
            toast.show(error.response.data.message, { type: 'error' });
          }
          setDeleteModalVisible(false);
        });
      
      if (response) {
        if (response.status && response.status === 200) {
          toast.show('Location deleted successfully', { type: 'success' });
          
          const newUserData = await checkAuthentication();
          setUserData(newUserData);
          setDeleteModalVisible(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    setSelectedLocation(null);
    setDeleteModalVisible(false);
  };

  const renderSavedLocations = () => {
    return (
      <ScrollView 
        style={[stylesLocations.locationsContainer]} 
        contentContainerStyle={{ flex: 1 }}
      >
        {userData.savedLocations.map((location, index) => (
          <View key={index} style={stylesLocations.locationRow}>
            <Text style={[styles.text, { fontSize: 16 }]}>{location.description}</Text>
            <View style={stylesLocations.actionsContainer}>
              <Pressable
                onPress={() => handleEditPress(location)}
              >
                <EditIcon
                  width={22}
                  height={22}
                  color={'#000'}
                />
              </Pressable>
              <Pressable
                onPress={() => handleDeletePress(location.userLocationId)}
              >
                <TrashIcon
                  width={27}
                  height={27}
                  color={'#FF7070'}
                />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      <SafeAreaView style={[styles.safeArea]}>
        <View style={[styles.topBar, { justifyContent: 'flex-start' }]}>
          <Pressable
            onPress={() => navigation.goBack()}
          >
            <ArrowBackIcon
              width={19}
              height={19}
              color={'#000'}
            />
          </Pressable>
          <Text style={[styles.topBarTitle]}>
            Manage saved locations
          </Text>
        </View>
          {userData?.savedLocations && userData?.savedLocations.length > 0 ? (
            renderSavedLocations()
          ) : (
            <View style={[styles.contentContainer, stylesLocations.noLocationsContainer]}>
              <Text style={[stylesLocations.noLocationsText, stylesLocations.noLocationsTitle]}>You do not have any saved locations</Text>
              <Text style={[stylesLocations.noLocationsText, stylesLocations.noLocationsHelp]}>You can save up to 3 locations while creating tasks and adding locations to them on the map.</Text>
            </View>
          )}
      </SafeAreaView>
      {deleteModalVisible && (
        <Modal
          visible={deleteModalVisible}
          animationType="fade"
          onRequestClose={handleCancelDelete}
          transparent
        >
          <Pressable
            onPress={handleCancelDelete}
            style={stylesLocations.innerModalContainer}
          >
            <Pressable>
              <View style={stylesLocations.innerModalContent}>
                <View style={stylesLocations.innerModalTexts}>
                  <Text style={stylesLocations.innerModalTitle}>
                    Are you sure you want to delete this location?
                  </Text>
                </View>
                <View style={stylesLocations.innerModalButtons}>
                  <TouchableOpacity
                    style={[
                      stylesLocations.innerModalButton,
                      stylesLocations.innerModalButtonRed
                    ]}
                    onPress={handleDelete}
                  >
                    <Text
                      style={[
                        stylesLocations.innerModalButtonText,
                        stylesLocations.innerModalButtonRedText
                      ]}
                    >
                        Delete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      stylesLocations.innerModalButton,
                      stylesLocations.innerModalButtonWhite
                    ]}
                    onPress={handleCancelDelete}
                  >
                    <Text
                      style={[
                        stylesLocations.innerModalButtonText,
                        stylesLocations.innerModalButtonWhiteText
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {editModalVisible && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
        />
      )}

      <EditLocationModal
        visible={editModalVisible}
        onClose={handleCancelEdit}
        location={selectedLocation}
      />
    </>
  )
}

const stylesLocations = StyleSheet.create({
  noLocationsContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLocationsText: {
    textAlign: 'center',
    fontFamily: 'poppins-regular',
  },
  noLocationsTitle: {
    fontSize: 14,
    marginBottom: 30,
    color: "#000",
  },
  noLocationsHelp: {
    fontSize: 12,
    color: '#7A7A7A',
  },
  locationsContainer: {
    marginTop: 10,
    flex: 1,
  },
  locationRow: { 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.09,
    shadowRadius: 8.0,
    elevation: 12
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  innerModalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxWidth: 350,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  innerModalTexts: {
    marginBottom: 20
  },
  innerModalTitle: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'poppins-regular',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 5
  },
  innerModalSubtitle: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'poppins-regular',
    lineHeight: 16,
    textAlign: 'center'
  },
  innerModalButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center'
  },
  innerModalButton: {
    alignItems: 'center',
    minWidth: 125,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8
  },
  innerModalButtonRed: {
    backgroundColor: '#FF7070'
  },
  innerModalButtonWhite: {
    backgroundColor: '#fff'
  },
  innerModalButtonText: {
    fontSize: 14,
    fontFamily: 'poppins-medium',
    lineHeight: 18
  },
  innerModalButtonRedText: {
    color: '#fff'
  },
  innerModalButtonWhiteText: {
    color: '#000'
  },
});
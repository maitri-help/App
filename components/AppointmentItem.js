import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function AppointmentItem({ appointment }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={appointment.image} style={styles.image} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{appointment.title}</Text>
        {appointment.description && <Text style={styles.description}>{appointment.description}</Text>}
        <Text style={styles.slot}>{appointment.slot}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 12,
    padding: 17,
  },
  imageWrapper: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  textContainer: {
    justifyContent: 'center',
    marginLeft: 15,
    flex: 1
  },
  title: {
    fontSize: 14,
    color: '#000',
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 3,
  },
  slot: {
    fontSize: 12,
    color: '#ccc',
  },
});

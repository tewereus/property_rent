import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapComponent = ({ onLocationSelect }) => {
  const [region, setRegion] = useState({
    latitude: 9.01942,
    longitude: 38.80169,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  const handleMapPress = (e) => {
    // Set marker position when the map is pressed
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    // Move marker to current location
    setMarkerPosition(coords);
    setRegion({
      ...region,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    // Update parent with current location
    onLocationSelect(coords);
  };

  const handleConfirmLocation = () => {
    if (markerPosition) {
      onLocationSelect(markerPosition); // Pass selected marker position to parent
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={handleMapPress}
      >
        {markerPosition && <Marker coordinate={markerPosition} />}
      </MapView>

      <Button title="Use Current Location" onPress={handleCurrentLocation} />
      {markerPosition && (
        <Button title="Confirm Location" onPress={handleConfirmLocation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "90%", // Adjust height as necessary
  },
});

export default MapComponent;

// import React, { useEffect, useState } from "react";
// import { View, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";

// const MapComponent = ({ onLocationSelect }) => {
//   const [region, setRegion] = useState({
//     latitude: 9.01942,
//     longitude: 38.80169,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [markerPosition, setMarkerPosition] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.error("Permission to access location was denied");
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setRegion({
//         ...region,
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//       });
//     })();
//   }, []);

//   const handleMapPress = (e) => {
//     const { latitude, longitude } = e.nativeEvent.coordinate;
//     setMarkerPosition({ latitude, longitude });
//     onLocationSelect({ latitude, longitude }); // Pass coordinates back to parent
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={region}
//         onPress={handleMapPress}
//       >
//         {markerPosition && <Marker coordinate={markerPosition} />}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

// export default MapComponent;

// client/src/components/MapComponent.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
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
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    onLocationSelect({ latitude, longitude }); // Pass coordinates back to parent
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%", // Ensure it takes full width
    height: "100%", // Ensure it takes full height
  },
});

export default MapComponent;

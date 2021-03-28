import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Input, Header } from "react-native-elements";

export default function MapScreen({ route }) {
  const { adress } = route.params;
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    /*Jostain syystä tällä url pitää vielä mainita kaupunki että löytää oikean osoitteen. Kokeilin kaverin url millä löytyi pelkästään katuosoitteella */
    let url =
      "http://www.mapquestapi.com/geocoding/v1/address?key=cDPcCSevpOFCXigo8AYdAsAhfqv3DolD&location=" +
      adress;
    fetch(url, {
      method: "GET",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.results[0].locations[0].latLng);
        setLocation(data.results[0].locations[0].latLng);
      });
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
        region={{
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.lat,
            longitude: location.lng,
          }}
        />
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 8,
  },
});

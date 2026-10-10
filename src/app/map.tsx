import { StyleSheet } from "react-native";
import MapView, { type MapPressEvent, type Region } from "react-native-maps";

export default function MapScreen() {
  const region: Region = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent): void {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    console.log("Selected location:", { latitude: lat, longitude: lng });
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

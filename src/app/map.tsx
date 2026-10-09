import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function MapScreen() {
  const region = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return <MapView style={styles.container} initialRegion={region}></MapView>;
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
});

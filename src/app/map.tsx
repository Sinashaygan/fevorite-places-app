import IconButton from "@/components/ui/IconButton";
import { usePlaces } from "@/context/PlacesContext";
import type { PlaceLocation } from "@/types/place";
import { router, useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, {
  Marker,
  type MapPressEvent,
  type Region,
} from "react-native-maps";

export default function MapScreen() {
  const navigation = useNavigation();
  const { draft, updateDraft } = usePlaces();
  const [selectedLocation, setSelectedLocation] = useState<PlaceLocation | null>(draft.location ?? null);
  const region: Region = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event: MapPressEvent): void {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ latitude: lat, longitude: lng });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        "No location picked",
        "You have to pick a location (by tapping on the map) first!",
      );
      return;
    }

    updateDraft({ location: selectedLocation });
    router.back();
  }, [selectedLocation, updateDraft]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }: { tintColor?: string }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor ?? "#ffffff"}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          coordinate={selectedLocation}
          title="Picked Location"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

import PlaceForm from "@/components/places/PlaceForm";
import type { Place } from "@/types/place";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

type PendingPlace = Pick<Place, "title" | "address" | "imageUri">;

export default function AddPlace() {
  function createPlaceHandler(place: PendingPlace) {
    Alert.alert(
      "Place ready",
      `${place.title} is ready to be connected to app storage.`,
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <PlaceForm onCreatePlace={createPlaceHandler} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

import PlaceForm from "@/components/places/PlaceForm";
import { usePlaces } from "@/context/PlacesContext";
import type { Place } from "@/types/place";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

type PendingPlace = Pick<
  Place,
  "title" | "address" | "imageUri" | "location"
>;

export default function AddPlace() {
  const { addPlace } = usePlaces();

  function createPlaceHandler(place: PendingPlace) {
    addPlace(place);
    router.replace("/");
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

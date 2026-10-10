import PlaceForm from "@/components/places/PlaceForm";
import { usePlaces } from "@/context/PlacesContext";
import type { Place } from "@/types/place";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

type PendingPlace = Pick<
  Place,
  "title" | "address" | "imageUri" | "location"
>;

export default function AddPlace() {
  const { addPlace, resetDraft } = usePlaces();
  const navigation = useNavigation();

  useEffect(() => {
    return navigation.addListener("beforeRemove", () => {
      resetDraft();
    });
  }, [navigation, resetDraft]);

  function createPlaceHandler(place: PendingPlace) {
    addPlace(place);
    resetDraft();
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

import PlaceForm from "@/components/places/PlaceForm";
import { usePlaces } from "@/context/PlacesContext";
import type { Place } from "@/types/place";
import { insertPlace } from "@/utils/database";
import { router, Stack, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

type PendingPlace = Pick<
  Place,
  "title" | "address" | "imageUri" | "location"
>;

export default function AddPlace() {
  const { addPlace, resetDraft } = usePlaces();
  const navigation = useNavigation();
  const savingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return navigation.addListener("beforeRemove", (event) => {
      if (savingRef.current) {
        event.preventDefault();
        return;
      }
      resetDraft();
    });
  }, [navigation, resetDraft]);

  async function createPlaceHandler(place: PendingPlace) {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    try {
      const savedPlace = {
        ...place,
        address: place.address?.trim() || "Address unavailable",
      };
      const id = await insertPlace(savedPlace);
      addPlace({ ...savedPlace, id: String(id) });
      resetDraft();
      savingRef.current = false;
      router.replace("/");
    } catch (error) {
      console.error("Failed to save place:", error);
      Alert.alert(
        "Unable to save place",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <Stack.Screen options={{ gestureEnabled: !isSaving, headerBackVisible: !isSaving }} />
      <View style={styles.screen} pointerEvents={isSaving ? "none" : "auto"}>
        <PlaceForm onCreatePlace={createPlaceHandler} isSaving={isSaving} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

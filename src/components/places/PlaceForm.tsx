import { COLORS } from "@/constants/colors";
import { usePlaces } from "@/context/PlacesContext";
import type { Place, PlaceLocation } from "@/types/place";
import { useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

type PlaceFormValues = Pick<
  Place,
  "title" | "address" | "imageUri" | "location"
>;

type PlaceFormProps = {
  onCreatePlace: (values: PlaceFormValues) => void;
};

export default function PlaceForm({ onCreatePlace }: PlaceFormProps) {
  const { draft, updateDraft } = usePlaces();
  const enteredTitle = draft.title;
  const enteredAddress = draft.address ?? "";
  const selectedImageUri = draft.imageUri;
  const selectedLocation = draft.location;

  const setEnteredTitle = useCallback((title: string) => {
    updateDraft({ title });
  }, [updateDraft]);
  const setEnteredAddress = useCallback((address: string) => {
    updateDraft({ address });
  }, [updateDraft]);
  const setSelectedImageUri = useCallback((imageUri: string) => {
    updateDraft({ imageUri });
  }, [updateDraft]);
  const setSelectedLocation = useCallback((location: PlaceLocation) => {
    updateDraft({ location });
  }, [updateDraft]);

  function savePlaceHandler() {
    const title = enteredTitle.trim();
    const address = enteredAddress.trim();

    if (!title) {
      Alert.alert(
        "Missing information",
        "Please enter a title for this place.",
      );
      return;
    }

    onCreatePlace({
      title,
      address: address || undefined,
      imageUri: selectedImageUri,
      location: selectedLocation || undefined,
    });
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Add a favorite place</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Place title</Text>
        <TextInput
          autoCapitalize="words"
          onChangeText={setEnteredTitle}
          placeholder="e.g. Central Park"
          placeholderTextColor="#64748b"
          style={styles.input}
          value={enteredTitle}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          autoCapitalize="sentences"
          multiline
          onChangeText={setEnteredAddress}
          placeholder="Enter the place address"
          placeholderTextColor="#64748b"
          style={[styles.input, styles.addressInput]}
          textAlignVertical="top"
          value={enteredAddress}
        />
      </View>

      <ImagePicker onImagePicked={setSelectedImageUri} imageUri={selectedImageUri}/>

      <LocationPicker
        location={selectedLocation}
        onPickLocation={setSelectedLocation}
        onAddressFound={setEnteredAddress}
      />

      <Pressable
        accessibilityRole="button"
        onPress={savePlaceHandler}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Add Place</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    marginBottom: 20,
    color: COLORS.primary500,
    fontSize: 26,
    fontWeight: "bold",
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: COLORS.primary200,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary700,
    backgroundColor: COLORS.primary100,
    color: COLORS.gray700,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  addressInput: {
    minHeight: 104,
  },
  primaryButton: {
    alignItems: "center",
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: COLORS.primary500,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: COLORS.gray700,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

import ImagePicker from "@/components/places/ImagePicker";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddPlace() {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");

  function handleChooseImage() {
    Alert.alert("Choose Image", "Image selection will be added next.");
  }

  function handleAddPlace() {
    if (!enteredTitle.trim() || !enteredAddress.trim()) {
      Alert.alert("Missing information", "Please enter a title and address.");
      return;
    }

    Alert.alert(
      "Place ready",
      "Saving places will be connected to app state or storage next.",
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Add a favorite place</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Place title</Text>
          <TextInput
            autoCapitalize="words"
            onChangeText={setEnteredTitle}
            placeholder="e.g. Central Park"
            placeholderTextColor="#94a3b8"
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
            placeholderTextColor="#94a3b8"
            style={[styles.input, styles.addressInput]}
            textAlignVertical="top"
            value={enteredAddress}
          />
        </View>

        <View style={styles.secondaryActions}>
          {/* <Pressable
            onPress={handleChooseImage}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Choose Image</Text>
          </Pressable> */}

          <ImagePicker/>

          <Pressable
            onPress={() => router.push("/map")}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Choose on Map</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleAddPlace}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Add Place</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
  },
  heading: {
    color: COLORS.primary500,
    fontWeight: "bold",
    fontSize: 26,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: COLORS.primary700,
    borderBottomWidth: 2,
    backgroundColor: COLORS.primary100,
  },
  addressInput: {
    minHeight: 104,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    marginTop: 28,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.75,
  },
});

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import PlacesList from "@/components/places/PlacesList";
import { COLORS } from "@/constants/colors";
import { usePlaces } from "@/context/PlacesContext";

export default function AllPlaces() {
  const { places } = usePlaces();

  function handleSelectPlace(id: string) {
    router.push({
      pathname: "/place-details",
      params: { id },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Your Favorite Places</Text>
        <Text style={styles.description}>
          Keep the places you love in one easy-to-find list.
        </Text>
      </View>

      <View style={styles.listContainer}>
        <PlacesList places={places} onSelectPlace={handleSelectPlace} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/add-place")}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Add a New Place</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.gray700,
  },
  headingContainer: {
    marginBottom: 16,
  },
  heading: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
  },
  description: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  listContainer: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.primary500,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  buttonText: {
    color: COLORS.gray700,
    fontSize: 16,
    fontWeight: "700",
  },
});

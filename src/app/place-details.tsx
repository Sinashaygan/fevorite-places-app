import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type PlaceDetailsParams = {
  id?: string | string[];
};

const mockPlace = {
  title: "Favorite place preview",
  address: "Saved place details will appear here.",
};

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<PlaceDetailsParams>();
  const placeId = Array.isArray(id) ? id[0] : id;

  if (!placeId) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Place Details</Text>
        <Text style={styles.message}>
          No place id was provided. Select a place from the main screen.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Place Details</Text>
      <Text style={styles.title}>{mockPlace.title}</Text>
      <Text style={styles.address}>{mockPlace.address}</Text>

      <View style={styles.idCard}>
        <Text style={styles.idLabel}>Place ID</Text>
        <Text selectable style={styles.idValue}>
          {placeId}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  eyebrow: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  address: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 16,
    lineHeight: 23,
  },
  message: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
  },
  idCard: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  idLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  idValue: {
    marginTop: 6,
    color: "#0f172a",
    fontSize: 15,
  },
});

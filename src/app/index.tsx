import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import PlacesList from "@/components/places/PlacesList";
import { Place } from "@/types/place";

export default function AllPlaces() {
  const places: Place[] = [];

  return (
    <View style={styles.container}>
      <PlacesList places={places} />

      <Link href="/add-place" style={styles.link}>
        Add a New Place
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  link: {
    marginTop: 20,
    color: "#3f51b5",
    fontSize: 16,
    textAlign: "center",
  },
});

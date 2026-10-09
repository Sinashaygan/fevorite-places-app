import type { Place } from "@/types/place";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type PlaceItemProps = {
  place: Place;
  onSelect: (id: string) => void;
};

export default function PlaceItem({ place, onSelect }: PlaceItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${place.title}`}
      onPress={() => onSelect(place.id)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {place.imageUri ? (
        <Image
          accessibilityLabel={`Photo of ${place.title}`}
          source={{ uri: place.imageUri }}
          style={styles.image}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.title}>
          {place.title}
        </Text>
        <Text numberOfLines={2} style={styles.address}>
          {place.address}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pressed: {
    opacity: 0.72,
  },
  image: {
    width: 112,
    minHeight: 112,
    backgroundColor: "#dbeafe",
  },
  imagePlaceholder: {
    width: 112,
    minHeight: 112,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbeafe",
  },
  placeholderText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },
  details: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "700",
  },
  address: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
});

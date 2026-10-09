import type { Place } from "@/types/place";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PlaceItem from "./PlaceItem";
import { COLORS } from "@/constants/colors";

type PlacesListProps = {
  places: Place[];
  onSelectPlace: (id: string) => void;
};

export default function PlacesList({
  places,
  onSelectPlace,
}: PlacesListProps) {
  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No places added yet — start adding some!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PlaceItem place={item} onSelect={onSelectPlace} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    color: COLORS.primary200,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
    textAlign: "center",
  },
});

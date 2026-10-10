import LocationMap from "@/components/places/LocationMap";
import { COLORS } from "@/constants/colors";
import { usePlaces } from "@/context/PlacesContext";
import { isValidPlaceLocation } from "@/utils/location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { places } = usePlaces();
  const insets = useSafeAreaInsets();
  const [failedImageUri, setFailedImageUri] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const placeId = Array.isArray(id) ? id[0] : id;
  const place = places.find((savedPlace) => savedPlace.id === placeId);
  const location = place?.location && isValidPlaceLocation(place.location)
    ? place.location
    : undefined;

  async function openMap() {
    if (!location) return;
    setMapError(null);
    try {
      await Linking.openURL(
        `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=16/${location.latitude}/${location.longitude}`,
      );
    } catch {
      setMapError("The map could not be opened. Please try again.");
    }
  }

  if (!place) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="compass-outline" size={44} color={COLORS.primary200} />
        </View>
        <Text style={styles.title}>Place not found</Text>
        <Text style={styles.emptyText}>
          This place is no longer available. Choose a place from your collection.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/")}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Back to my places</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        {place.imageUri && failedImageUri !== place.imageUri ? (
          <Image
            source={{ uri: place.imageUri }}
            accessibilityLabel={`Photo of ${place.title}`}
            style={styles.photo}
            resizeMode="cover"
            onError={() => setFailedImageUri(place.imageUri)}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="image-outline" size={52} color={COLORS.primary200} />
            <Text style={styles.muted}>A place worth remembering</Text>
          </View>
        )}
        <View style={styles.badge}>
          <Ionicons name="heart" size={14} color={COLORS.primary200} />
          <Text style={styles.badgeText}>FAVORITE PLACE</Text>
        </View>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>YOUR PERSONAL COLLECTION</Text>
        <Text accessibilityRole="header" selectable style={styles.title}>{place.title}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={21} color={COLORS.primary400} />
          <Text selectable style={styles.address}>{place.address?.trim() || "No address added"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <View style={styles.iconTile}>
            <Ionicons name="navigate-outline" size={22} color={COLORS.primary200} />
          </View>
          <View style={styles.sectionLabels}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>On the map</Text>
            <Text style={styles.muted}>{location ? "Your saved spot, ready to revisit." : "No location saved for this place."}</Text>
          </View>
        </View>

        {location ? (
          <>
            <LocationMap location={location} />
            <View style={styles.coordinates}>
              <View style={styles.coordinate}>
                <Text style={styles.coordinateLabel}>LATITUDE</Text>
                <Text selectable style={styles.coordinateValue}>{location.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordinate}>
                <Text style={styles.coordinateLabel}>LONGITUDE</Text>
                <Text selectable style={styles.coordinateValue}>{location.longitude.toFixed(6)}</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Open ${place.title} in OpenStreetMap`}
              onPress={openMap}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            >
              <Ionicons name="map-outline" size={20} color={COLORS.gray700} />
              <Text style={styles.buttonText}>Open in maps</Text>
              <Ionicons name="arrow-up-right-box-outline" size={18} color={COLORS.gray700} />
            </Pressable>
            {mapError && <Text accessibilityRole="alert" style={styles.error}>{mapError}</Text>}
          </>
        ) : (
          <View style={styles.locationPlaceholder}>
            <Ionicons name="earth-outline" size={42} color={COLORS.muted} />
            <Text style={styles.emptyText}>A favorite doesn’t need coordinates.</Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Ionicons name="bookmark-outline" size={15} color={COLORS.muted} />
        <Text style={styles.muted}>Saved in your favorite places</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.gray700 },
  content: { padding: 20, gap: 24, maxWidth: 720, width: "100%", alignSelf: "center" },
  hero: { borderRadius: 24, overflow: "hidden", backgroundColor: COLORS.surface },
  photo: { width: "100%", aspectRatio: 1.3 },
  photoPlaceholder: { aspectRatio: 1.3, justifyContent: "center", alignItems: "center", gap: 14 },
  badge: { position: "absolute", left: 16, bottom: 16, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(34,28,48,0.92)", borderRadius: 20, paddingVertical: 9, paddingHorizontal: 13 },
  badgeText: { color: COLORS.text, fontSize: 11, fontWeight: "700", letterSpacing: 1.2 },
  intro: { gap: 12 },
  eyebrow: { color: COLORS.primary200, fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  title: { color: COLORS.text, fontSize: 32, lineHeight: 40, fontWeight: "800" },
  addressRow: { flexDirection: "row", alignItems: "flex-start", gap: 9 },
  address: { flex: 1, color: COLORS.muted, fontSize: 15, lineHeight: 24 },
  card: { padding: 16, gap: 20, backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconTile: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.gray700 },
  sectionLabels: { flex: 1, gap: 4 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  muted: { color: COLORS.muted, fontSize: 13, lineHeight: 20 },
  coordinates: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  coordinate: { flex: 1, minWidth: 100, gap: 6, padding: 12, backgroundColor: COLORS.gray700, borderRadius: 12 },
  coordinateLabel: { color: COLORS.muted, fontSize: 10, letterSpacing: 1.4, fontWeight: "600" },
  coordinateValue: { color: COLORS.primary50, fontSize: 16, fontWeight: "600", fontVariant: ["tabular-nums"] },
  button: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.primary500, padding: 16, borderRadius: 14, minHeight: 52 },
  buttonText: { color: COLORS.gray700, fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.75 },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  empty: { flex: 1, backgroundColor: COLORS.gray700, justifyContent: "center", alignItems: "center", padding: 28, gap: 20 },
  emptyIcon: { padding: 24, backgroundColor: COLORS.surface, borderRadius: 28 },
  emptyText: { color: COLORS.muted, fontSize: 15, lineHeight: 24, textAlign: "center" },
  locationPlaceholder: { padding: 24, alignItems: "center", gap: 12 },
  error: { color: COLORS.accent500, fontSize: 13, lineHeight: 20 },
});

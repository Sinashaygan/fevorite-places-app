import { COLORS } from "@/constants/colors";
import type { PlaceLocation } from "@/types/place";
import { isValidPlaceLocation } from "@/utils/location";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type LocationMapProps = {
  location: PlaceLocation;
};

export default function LocationMap({ location }: LocationMapProps) {
  const isValid = isValidPlaceLocation(location);

  function openOpenStreetMap() {
    if (!isValid) {
      return;
    }

    const url = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=15/${location.latitude}/${location.longitude}`;
    void Linking.openURL(url);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {isValid
          ? "The interactive map is available in the Android and iOS app."
          : "The selected coordinates are invalid."}
      </Text>
      {isValid && (
        <Pressable
          accessibilityRole="link"
          onPress={openOpenStreetMap}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Open in OpenStreetMap</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primary100,
    padding: 20,
  },
  message: {
    color: COLORS.gray700,
    lineHeight: 21,
    textAlign: "center",
  },
  button: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.primary500,
    fontWeight: "700",
  },
});

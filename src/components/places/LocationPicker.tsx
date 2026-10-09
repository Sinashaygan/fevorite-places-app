import { COLORS } from "@/constants/colors";
import type { PlaceLocation } from "@/types/place";
import { isValidPlaceLocation } from "@/utils/location";
import {
  Accuracy,
  getCurrentPositionAsync,
  hasServicesEnabledAsync,
  useForegroundPermissions,
} from "expo-location";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

import OutlinedButton from "../ui/OutlinedButton";
import LocationMap from "./LocationMap";

type LocationPickerProps = {
  onPickLocation: (location: PlaceLocation) => void;
};

export default function LocationPicker({
  onPickLocation,
}: LocationPickerProps) {
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const [pickedLocation, setPickedLocation] = useState<PlaceLocation | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const isRequestInProgress = useRef(false);

  function openAppSettings() {
    void Linking.openSettings().catch(() => {
      Alert.alert(
        "Unable to open settings",
        "Open your device settings and enable location access for this app.",
      );
    });
  }

  function showPermissionSettingsAlert() {
    Alert.alert(
      "Location permission required",
      "Location access has been blocked. Enable it for this app in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: openAppSettings },
      ],
    );
  }

  async function verifyPermission() {
    if (locationPermissionInformation?.granted) {
      return true;
    }

    if (
      !locationPermissionInformation ||
      locationPermissionInformation.canAskAgain
    ) {
      const permissionResponse = await requestPermission();

      if (!permissionResponse.granted && !permissionResponse.canAskAgain) {
        showPermissionSettingsAlert();
      }

      return permissionResponse.granted;
    }

    showPermissionSettingsAlert();
    return false;
  }

  async function getLocationHandler() {
    if (isRequestInProgress.current) {
      return;
    }

    isRequestInProgress.current = true;
    setIsLocating(true);
    setLocationError(null);

    try {
      const hasPermission = await verifyPermission();

      if (!hasPermission) {
        setLocationError("Location permission was not granted.");
        return;
      }

      const servicesEnabled = await hasServicesEnabledAsync();

      if (!servicesEnabled) {
        setLocationError("Location services are turned off.");
        Alert.alert(
          "Location services are off",
          "Turn on Location Services in your device settings and try again.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: openAppSettings },
          ],
        );
        return;
      }

      const result = await getCurrentPositionAsync({
        accuracy: Accuracy.Balanced,
      });
      const location: PlaceLocation = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      };

      if (!isValidPlaceLocation(location)) {
        setLocationError("The device returned invalid coordinates.");
        return;
      }

      setPickedLocation(location);
      onPickLocation(location);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Your current location could not be determined.";
      setLocationError(message);
      Alert.alert("Location unavailable", message);
    } finally {
      isRequestInProgress.current = false;
      setIsLocating(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapPreview}>
        {pickedLocation ? (
          <LocationMap location={pickedLocation} />
        ) : (
          <Text style={styles.placeholderText}>
            No position has been selected yet.
          </Text>
        )}
      </View>

      {pickedLocation && (
        <Text style={styles.coordinates}>
          Latitude: {pickedLocation.latitude.toFixed(6)} · Longitude:{" "}
          {pickedLocation.longitude.toFixed(6)}
        </Text>
      )}

      {locationError && (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {locationError}
        </Text>
      )}

      <View style={styles.actions}>
        <OutlinedButton
          disabled={isLocating}
          icon="location"
          onPress={getLocationHandler}
        >
          {isLocating ? "Locating…" : "Locate User"}
        </OutlinedButton>
        {isLocating && (
          <ActivityIndicator color={COLORS.primary500} size="small" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  mapPreview: {
    width: "100%",
    minHeight: 260,
    marginVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: COLORS.primary100,
  },
  placeholderText: {
    color: COLORS.gray700,
    fontSize: 15,
    textAlign: "center",
  },
  coordinates: {
    color: COLORS.primary200,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  errorText: {
    marginTop: 8,
    color: COLORS.accent500,
    lineHeight: 20,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});

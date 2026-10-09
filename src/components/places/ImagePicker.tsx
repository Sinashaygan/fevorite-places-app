import { COLORS } from "@/constants/colors";
import { launchCameraAsync, useCameraPermissions } from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "../ui/OutlinedButton";

type ImagePickerProps = {
  onImagePicked: (imageUri: string) => void;
};

export default function ImagePicker({ onImagePicked }: ImagePickerProps) {
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  async function verifyPermission() {
    if (cameraPermissionInformation?.granted) {
      return true;
    }

    if (
      !cameraPermissionInformation ||
      cameraPermissionInformation.canAskAgain
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    Alert.alert(
      "Insufficient Permissions",
      "Camera permission is required to take a place photo. Enable it in your device settings.",
    );
    return false;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermission();

    if (!hasPermission) {
      return;
    }

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });

      if (result.canceled) {
        return;
      }

      const imageUri = result.assets[0]?.uri;

      if (!imageUri) {
        Alert.alert(
          "Image unavailable",
          "The captured image could not be read.",
        );
        return;
      }

      setPickedImage(imageUri);
      onImagePicked(imageUri);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "The camera could not be opened. Please try again.";
      Alert.alert("Camera error", message);
    }
  }

  return (
    <View>
      <View style={styles.imagePreview}>
        {pickedImage ? (
          <Image source={{ uri: pickedImage }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No image taken yet.</Text>
        )}
      </View>

      <OutlinedButton icon="camera" onPress={takeImageHandler}>Take image</OutlinedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.primary100,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    color: COLORS.gray700,
    fontSize: 15,
  },
  button: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.primary500,
    fontSize: 15,
    fontWeight: "700",
  },
});

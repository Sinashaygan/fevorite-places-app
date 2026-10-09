import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import type { PressableProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type IconButtonProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  size: number;
  color: ComponentProps<typeof Ionicons>["color"];
  onPress: PressableProps["onPress"];
};

export default function IconButton({
  icon,
  size,
  color,
  onPress,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

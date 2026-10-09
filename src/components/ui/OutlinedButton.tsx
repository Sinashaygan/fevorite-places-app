import type { ComponentProps, ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type OutlinedButtonProps = {
  onPress: NonNullable<PressableProps["onPress"]>;
  icon: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
};

export default function OutlinedButton({
  onPress,
  icon,
  children,
}: OutlinedButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons
        style={styles.icon}
        name={icon}
        size={18}
        color={COLORS.primary500}
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary500,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: COLORS.primary500,
  },
});

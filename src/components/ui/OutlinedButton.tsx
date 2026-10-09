import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { PressableProps } from "react-native";

import { COLORS } from "@/constants/colors";

type OutlinedButtonProps = {
  onPress: NonNullable<PressableProps["onPress"]>;
  icon: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
  disabled?: boolean;
};

export default function OutlinedButton({
  onPress,
  icon,
  children,
  disabled = false,
}: OutlinedButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Ionicons
        color={disabled ? COLORS.primary200 : COLORS.primary500}
        name={icon}
        size={18}
        style={styles.icon}
      />
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.65,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: COLORS.primary500,
  },
  disabledText: {
    color: COLORS.primary200,
  },
});

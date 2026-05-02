import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";

interface Props {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  size?: "sm" | "md";
}

export function QuantitySelector({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  size = "md",
}: Props) {
  const colors = useColors();
  const btnSize = size === "sm" ? 28 : 36;
  const fontSize = size === "sm" ? 14 : 16;

  function handleIncrement() {
    onIncrement();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleDecrement() {
    if (value > min) {
      onDecrement();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [
          styles.btn,
          {
            width: btnSize,
            height: btnSize,
            borderRadius: btnSize / 2,
            backgroundColor: value <= min ? colors.muted : colors.secondary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        onPress={handleDecrement}
        disabled={value <= min}
      >
        <Feather name="minus" size={size === "sm" ? 12 : 16} color={colors.primary} />
      </Pressable>

      <Text
        style={[
          styles.count,
          { color: colors.foreground, fontSize, minWidth: size === "sm" ? 24 : 32 },
        ]}
      >
        {value}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.btn,
          {
            width: btnSize,
            height: btnSize,
            borderRadius: btnSize / 2,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={handleIncrement}
      >
        <Feather name="plus" size={size === "sm" ? 12 : 16} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
});

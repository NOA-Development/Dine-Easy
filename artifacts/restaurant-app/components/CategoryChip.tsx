import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { Category } from "@/lib/database";
import { useColors } from "@/hooks/useColors";

interface Props {
  category: Category;
  selected: boolean;
  onSelect: () => void;
}

export function CategoryChip({ category, selected, onSelect }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={onSelect}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? "#fff" : colors.foreground },
        ]}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    marginRight: 8,
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});

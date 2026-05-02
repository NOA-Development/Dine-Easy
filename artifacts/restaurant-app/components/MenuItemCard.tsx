import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/lib/database";
import { getFoodImage } from "@/lib/images";
import { useColors } from "@/hooks/useColors";

interface Props {
  item: MenuItem;
  horizontal?: boolean;
}

export function MenuItemCard({ item, horizontal = false }: Props) {
  const colors = useColors();
  const { addItem, items } = useCart();
  const router = useRouter();
  const inCart = items.find((i) => i.menuItem.id === item.id);

  function handleAdd(e: any) {
    e.stopPropagation?.();
    addItem(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  if (horizontal) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.hCard,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
        ]}
        onPress={() => router.push(`/meal/${item.id}`)}
      >
        <Image
          source={getFoodImage(item.image_key)}
          style={styles.hImage}
          contentFit="cover"
        />
        <View style={styles.hInfo}>
          <Text style={[styles.hName, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color="#FFB800" />
            <Text style={[styles.rating, { color: colors.mutedForeground }]}>
              {" "}{item.rating.toFixed(1)}
            </Text>
            <Text style={[styles.dot, { color: colors.mutedForeground }]}> · </Text>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.rating, { color: colors.mutedForeground }]}>
              {" "}{item.prep_time}
            </Text>
          </View>
          <View style={styles.hBottom}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${item.price.toFixed(2)}
            </Text>
            <Pressable
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={handleAdd}
              hitSlop={8}
            >
              <Feather name="plus" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      onPress={() => router.push(`/meal/${item.id}`)}
    >
      <Image
        source={getFoodImage(item.image_key)}
        style={styles.image}
        contentFit="cover"
      />
      {item.is_popular === 1 && (
        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={12} color="#FFB800" />
          <Text style={[styles.rating, { color: colors.mutedForeground }]}>
            {" "}{item.rating.toFixed(1)}
          </Text>
          <Text style={[styles.dot, { color: colors.mutedForeground }]}> · </Text>
          <Text style={[styles.rating, { color: colors.mutedForeground }]}>
            {item.prep_time}
          </Text>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              {
                backgroundColor: inCart ? colors.secondary : colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleAdd}
            hitSlop={8}
          >
            <Feather name="plus" size={16} color={inCart ? colors.primary : "#fff"} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: 140,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    fontSize: 12,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  popularBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  popularText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  hCard: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    width: 280,
    marginRight: 12,
  },
  hImage: {
    width: 100,
    height: 100,
  },
  hInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  hName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  hBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

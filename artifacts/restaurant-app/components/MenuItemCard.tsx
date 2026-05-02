import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { MenuItem } from "@/lib/database";
import { getFoodImage } from "@/lib/images";
import { useColors } from "@/hooks/useColors";

interface Props {
  item: MenuItem;
  horizontal?: boolean;
  adminMode?: boolean;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
  onToggleAvailable?: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  horizontal = false,
  adminMode = false,
  onEdit,
  onDelete,
  onToggleAvailable,
}: Props) {
  const colors = useColors();
  const { addItem, items } = useCart();
  const router = useRouter();
  const { t } = useLanguage();
  const inCart = items.find((i) => i.menuItem.id === item.id);
  const isUnavailable = item.is_available === 0;

  function handleAdd(e: any) {
    e.stopPropagation?.();
    addItem(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handlePress() {
    if (adminMode && onEdit) {
      onEdit(item);
    } else if (!isUnavailable) {
      router.push(`/meal/${item.id}`);
    }
  }

  function handleDelete(e: any) {
    e.stopPropagation?.();
    Alert.alert(t("deleteItem"), t("deleteConfirm"), [
      { text: t("cancel"), style: "cancel" },
      { text: t("delete"), style: "destructive", onPress: () => onDelete?.(item) },
    ]);
  }

  function handleToggle(e: any) {
    e.stopPropagation?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleAvailable?.(item);
  }

  if (horizontal) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.hCard,
          { backgroundColor: colors.card, borderColor: adminMode && isUnavailable ? colors.destructive + "55" : colors.border, opacity: pressed ? 0.9 : isUnavailable && !adminMode ? 0.5 : 1 },
        ]}
        onPress={handlePress}
      >
        <Image source={getFoodImage(item.image_key)} style={styles.hImage} contentFit="cover" />
        <View style={styles.hInfo}>
          <Text style={[styles.hName, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color="#FFB800" />
            <Text style={[styles.rating, { color: colors.mutedForeground }]}> {item.rating.toFixed(1)}</Text>
            <Text style={[styles.dot, { color: colors.mutedForeground }]}> · </Text>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.rating, { color: colors.mutedForeground }]}> {item.prep_time}</Text>
          </View>
          <View style={styles.hBottom}>
            <Text style={[styles.price, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
            {adminMode ? (
              <View style={styles.adminMiniRow}>
                <Pressable style={[styles.adminMiniBtn, { backgroundColor: colors.secondary }]} onPress={handleToggle} hitSlop={6}>
                  <Feather name={isUnavailable ? "eye-off" : "eye"} size={14} color={isUnavailable ? colors.destructive : colors.primary} />
                </Pressable>
                <Pressable style={[styles.adminMiniBtn, { backgroundColor: colors.secondary }]} onPress={handleDelete} hitSlop={6}>
                  <Feather name="trash-2" size={14} color={colors.destructive} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={handleAdd} hitSlop={8}>
                <Feather name="plus" size={16} color="#fff" />
              </Pressable>
            )}
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
          borderColor: adminMode && isUnavailable ? colors.destructive + "55" : colors.border,
          opacity: pressed ? 0.92 : isUnavailable && !adminMode ? 0.5 : 1,
        },
      ]}
      onPress={handlePress}
    >
      <View style={{ position: "relative" }}>
        <Image source={getFoodImage(item.image_key)} style={styles.image} contentFit="cover" />

        {/* Unavailable overlay */}
        {isUnavailable && adminMode && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>{t("unavailable")}</Text>
          </View>
        )}

        {/* Popular badge */}
        {item.is_popular === 1 && !adminMode && (
          <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.popularText}>{t("popular")}</Text>
          </View>
        )}

        {/* Admin top-right actions */}
        {adminMode && (
          <View style={styles.adminTopRow}>
            <Pressable
              style={[styles.adminTopBtn, { backgroundColor: isUnavailable ? colors.destructive : "#22C55E" }]}
              onPress={handleToggle}
              hitSlop={6}
            >
              <Feather name={isUnavailable ? "eye-off" : "eye"} size={13} color="#fff" />
            </Pressable>
            <Pressable
              style={[styles.adminTopBtn, { backgroundColor: "rgba(0,0,0,0.55)" }]}
              onPress={(e) => { e.stopPropagation?.(); onEdit?.(item); }}
              hitSlop={6}
            >
              <Feather name="edit-2" size={13} color="#fff" />
            </Pressable>
            <Pressable
              style={[styles.adminTopBtn, { backgroundColor: "rgba(220,38,38,0.85)" }]}
              onPress={handleDelete}
              hitSlop={6}
            >
              <Feather name="trash-2" size={13} color="#fff" />
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>{item.description}</Text>
        <View style={styles.ratingRow}>
          <Feather name="star" size={12} color="#FFB800" />
          <Text style={[styles.rating, { color: colors.mutedForeground }]}> {item.rating.toFixed(1)}</Text>
          <Text style={[styles.dot, { color: colors.mutedForeground }]}> · </Text>
          <Text style={[styles.rating, { color: colors.mutedForeground }]}>{item.prep_time}</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={[styles.price, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
          {!adminMode && (
            <Pressable
              style={({ pressed }) => [
                styles.addBtn,
                { backgroundColor: inCart ? colors.secondary : colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleAdd}
              hitSlop={8}
              disabled={isUnavailable}
            >
              <Feather name="plus" size={16} color={inCart ? colors.primary : "#fff"} />
            </Pressable>
          )}
          {adminMode && (
            <View style={[styles.availBadge, { backgroundColor: isUnavailable ? colors.destructive + "22" : "#22C55E22" }]}>
              <Text style={[styles.availText, { color: isUnavailable ? colors.destructive : "#16A34A" }]}>
                {isUnavailable ? t("unavailable") : t("available")}
              </Text>
            </View>
          )}
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
  image: { width: "100%", height: 140 },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableText: { color: "#fff", fontSize: 13, fontFamily: "Inter_700Bold" },
  popularBadge: {
    position: "absolute", top: 8, left: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  popularText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  adminTopRow: {
    position: "absolute", top: 8, right: 8,
    flexDirection: "row", gap: 5,
  },
  adminTopBtn: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  info: { padding: 12 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16, marginBottom: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  rating: { fontSize: 12, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 12 },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  addBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  availBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  availText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  hCard: {
    flexDirection: "row", borderRadius: 16, overflow: "hidden",
    borderWidth: 1, width: 280, marginRight: 12,
  },
  hImage: { width: 100, height: 100 },
  hInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  hName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  hBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  adminMiniRow: { flexDirection: "row", gap: 6 },
  adminMiniBtn: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});

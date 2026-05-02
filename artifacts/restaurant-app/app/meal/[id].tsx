import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { MenuItem, db_ops } from "@/lib/database";
import { getFoodImage } from "@/lib/images";
import { useColors } from "@/hooks/useColors";

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addItem, items } = useCart();
  const { t } = useLanguage();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [isFaved, setIsFaved] = useState(false);

  const EXTRAS = [
    { id: 1, label: t("addCheese"), price: 1.5 },
    { id: 2, label: t("extraSauce"), price: 0.5 },
    { id: 3, label: t("extraMeat"), price: 2.0 },
  ];

  useEffect(() => {
    if (id) setItem(db_ops.getMenuItemById(Number(id)));
  }, [id]);

  const extrasTotal = EXTRAS.filter((e) => selectedExtras.includes(e.id)).reduce((s, e) => s + e.price, 0);
  const unitPrice = (item?.price ?? 0) + extrasTotal;
  const totalPrice = unitPrice * quantity;

  function toggleExtra(extraId: number) {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function addToCart() {
    if (!item) return;
    for (let i = 0; i < quantity; i++) addItem(item);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  if (!item) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.mutedForeground }}>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imgWrap}>
          <Image source={getFoodImage(item.image_key)} style={styles.img} contentFit="cover" />
          <View style={styles.overlay} />
          <View style={[styles.topNav, { top: insets.top + 12 }]}>
            <Pressable style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <Pressable
              style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}
              onPress={() => { setIsFaved(!isFaved); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Feather name="heart" size={20} color={isFaved ? "#FF6B00" : "#fff"} />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>{item.name}</Text>
            <Text style={[styles.price, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="star" size={14} color="#FFB800" />
              <Text style={[styles.metaText, { color: colors.foreground }]}>{item.rating.toFixed(1)}</Text>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.prep_time}</Text>
            </View>
            {item.category_name && (
              <>
                <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
                <View style={styles.metaItem}>
                  <Feather name="tag" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.category_name}</Text>
                </View>
              </>
            )}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{t("description")}</Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]}>{item.description}</Text>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{t("additionalOptions")}</Text>
          {EXTRAS.map((extra) => {
            const selected = selectedExtras.includes(extra.id);
            return (
              <Pressable
                key={extra.id}
                style={[
                  styles.extraRow,
                  { backgroundColor: selected ? colors.secondary : colors.card, borderColor: selected ? colors.primary : colors.border },
                ]}
                onPress={() => toggleExtra(extra.id)}
              >
                <Text style={[styles.extraLabel, { color: colors.foreground }]}>{extra.label}</Text>
                <View style={styles.extraRight}>
                  <Text style={[styles.extraPrice, { color: colors.mutedForeground }]}>+${extra.price.toFixed(2)}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : "transparent" },
                    ]}
                  >
                    {selected && <Feather name="check" size={12} color="#fff" />}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background, borderColor: colors.border }]}>
        <QuantitySelector
          value={quantity}
          onIncrement={() => setQuantity((q) => q + 1)}
          onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
          min={1}
        />
        <Pressable
          style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          onPress={addToCart}
        >
          <Text style={styles.addBtnText}>{t("addToCart")}</Text>
          <Text style={styles.addBtnPrice}>${totalPrice.toFixed(2)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  imgWrap: { height: 320, position: "relative" },
  img: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.08)" },
  topNav: { position: "absolute", left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
  navBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, gap: 12 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  name: { flex: 1, fontSize: 22, fontFamily: "Inter_700Bold", lineHeight: 30 },
  price: { fontSize: 22, fontFamily: "Inter_700Bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  metaDivider: { width: 1, height: 14 },
  sectionLabel: { fontSize: 16, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  extraRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderRadius: 14, borderWidth: 1.5, marginBottom: 8 },
  extraLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  extraRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  extraPrice: { fontSize: 13, fontFamily: "Inter_500Medium" },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1 },
  addBtn: { flex: 1, marginLeft: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16 },
  addBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  addBtnPrice: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});

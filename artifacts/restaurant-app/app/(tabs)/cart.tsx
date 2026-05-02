import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import { QuantitySelector } from "@/components/QuantitySelector";
import { EmptyState } from "@/components/EmptyState";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getFoodImage } from "@/lib/images";
import { useColors } from "@/hooks/useColors";

const DELIVERY_FEE = 3.99;
const PROMO_CODE = "WELCOME10";
const PROMO_DISCOUNT = 0.1;

export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, subtotal, updateQuantity, removeItem, totalItems } = useCart();
  const { t } = useLanguage();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? subtotal * PROMO_DISCOUNT : 0;
  const total = subtotal - discount + (items.length > 0 ? DELIVERY_FEE : 0);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  function applyPromo() {
    if (promo.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("myCart")}</Text>
        {totalItems > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{totalItems} {totalItems === 1 ? t("item") : t("items")}</Text>
          </View>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyState icon="shopping-cart" title={t("cartEmpty")} subtitle={t("cartEmptySub")} />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.menuItem.id.toString()}
            contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Image
                  source={getFoodImage(item.menuItem.image_key)}
                  style={styles.cartImg}
                  contentFit="cover"
                />
                <View style={styles.cartInfo}>
                  <Text style={[styles.cartName, { color: colors.foreground }]} numberOfLines={1}>
                    {item.menuItem.name}
                  </Text>
                  <Text style={[styles.cartPrice, { color: colors.primary }]}>
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </Text>
                  <View style={styles.cartBottom}>
                    <QuantitySelector
                      value={item.quantity}
                      onIncrement={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      onDecrement={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      min={0}
                      size="sm"
                    />
                    <Pressable onPress={() => removeItem(item.menuItem.id)} hitSlop={8}>
                      <Feather name="trash-2" size={18} color={colors.destructive} />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Promo */}
          <View style={[styles.promoRow, { paddingHorizontal: 16 }]}>
            <TextInput
              style={[styles.promoInput, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.muted }]}
              placeholder={t("promoPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              value={promo}
              onChangeText={setPromo}
              autoCapitalize="characters"
              editable={!promoApplied}
            />
            <Pressable
              style={[styles.promoBtn, { backgroundColor: promoApplied ? colors.success : colors.primary }]}
              onPress={applyPromo}
              disabled={promoApplied}
            >
              <Text style={styles.promoBtnText}>{promoApplied ? t("applied") : t("apply")}</Text>
            </Pressable>
          </View>

          {/* Summary */}
          <View style={[styles.summary, { marginHorizontal: 16, backgroundColor: colors.card, borderColor: colors.border }]}>
            <SummaryRow label={t("subtotal")} value={`$${subtotal.toFixed(2)}`} colors={colors} />
            {promoApplied && (
              <SummaryRow label={t("discount")} value={`-$${discount.toFixed(2)}`} colors={colors} isDiscount />
            )}
            <SummaryRow label={t("delivery")} value={`$${DELIVERY_FEE.toFixed(2)}`} colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SummaryRow label={t("total")} value={`$${total.toFixed(2)}`} colors={colors} isBold />
          </View>

          <View style={[styles.checkoutWrap, { paddingBottom: bottomInset + 16 }]}>
            <Pressable
              style={({ pressed }) => [
                styles.checkoutBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => router.push({ pathname: "/checkout", params: { total: total.toFixed(2) } })}
            >
              <Text style={styles.checkoutText}>{t("proceedCheckout")}</Text>
              <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function SummaryRow({
  label, value, colors, isBold, isDiscount,
}: {
  label: string; value: string; colors: any; isBold?: boolean; isDiscount?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: isBold ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          {
            color: isDiscount ? "#22C55E" : colors.foreground,
            fontFamily: isBold ? "Inter_700Bold" : "Inter_500Medium",
            fontSize: isBold ? 18 : 14,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: "#fff", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  cartItem: { flexDirection: "row", borderRadius: 16, overflow: "hidden", borderWidth: 1 },
  cartImg: { width: 90, height: 90 },
  cartInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  cartName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cartPrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  cartBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  promoRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  promoInput: {
    flex: 1, borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, fontFamily: "Inter_400Regular",
  },
  promoBtn: { paddingHorizontal: 16, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  promoBtnText: { color: "#fff", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  summary: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 10, marginBottom: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 14 },
  summaryValue: {},
  divider: { height: 1, marginVertical: 4 },
  checkoutWrap: { paddingHorizontal: 16 },
  checkoutBtn: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 18, paddingHorizontal: 24, borderRadius: 18,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  checkoutTotal: { color: "#fff", fontSize: 16, fontFamily: "Inter_700Bold" },
});

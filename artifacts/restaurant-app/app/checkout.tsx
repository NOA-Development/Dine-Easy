import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollViewCompat } from "react-native-keyboard-controller";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { db_ops } from "@/lib/database";
import { useColors } from "@/hooks/useColors";

const DELIVERY_FEE = 3.99;
type PaymentMethod = "cash" | "card";

export default function CheckoutScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { total: totalParam } = useLocalSearchParams<{ total: string }>();
  const { items, subtotal, clearCart } = useCart();
  const { t } = useLanguage();

  const [name, setName] = useState("Abdullah");
  const [phone, setPhone] = useState("+1 555 000 0000");
  const [address, setAddress] = useState("123 Food Street, Flavor City");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(false);

  const total = parseFloat(totalParam ?? "0");
  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    AsyncStorage.getItem("user_name").then((n) => { if (n) setName(n); });
    AsyncStorage.getItem("user_phone").then((p) => { if (p) setPhone(p); });
    AsyncStorage.getItem("user_address").then((a) => { if (a) setAddress(a); });
  }, []);

  async function placeOrder() {
    if (!name.trim() || !address.trim()) return;
    setLoading(true);
    try {
      const orderId = db_ops.createOrder(
        { status: "confirmed", subtotal, delivery_fee: DELIVERY_FEE, total, customer_name: name, customer_phone: phone, delivery_address: address, notes },
        items.map((i) => ({ item_name: i.menuItem.name, item_price: i.menuItem.price, quantity: i.quantity }))
      );
      clearCart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: "/order-success", params: { orderId: orderId.toString() } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("checkout")}</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: bottomInset + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title={t("shippingAddress")} icon="map-pin" colors={colors}>
          <Field label={t("fullName")} value={name} onChangeText={setName} colors={colors} />
          <Field label={t("phone")} value={phone} onChangeText={setPhone} colors={colors} keyboardType="phone-pad" />
          <Field label={t("address")} value={address} onChangeText={setAddress} colors={colors} />
          <Field label={t("notesOptional")} value={notes} onChangeText={setNotes} colors={colors} multiline />
        </SectionCard>

        <SectionCard title={t("paymentMethod")} icon="credit-card" colors={colors}>
          <PayBtn label={t("cashOnDelivery")} icon="dollar-sign" selected={paymentMethod === "cash"} onPress={() => setPaymentMethod("cash")} colors={colors} />
          <PayBtn label={t("creditCard")} icon="credit-card" selected={paymentMethod === "card"} onPress={() => setPaymentMethod("card")} colors={colors} />
        </SectionCard>

        <SectionCard title={t("orderSummary")} icon="list" colors={colors}>
          {items.map((item) => (
            <View key={item.menuItem.id} style={styles.summaryItem}>
              <Text style={[styles.summaryName, { color: colors.foreground }]} numberOfLines={1}>
                {item.quantity}x {item.menuItem.name}
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.foreground }]}>
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryName, { color: colors.mutedForeground }]}>{t("delivery")}</Text>
            <Text style={[styles.summaryPrice, { color: colors.mutedForeground }]}>${DELIVERY_FEE.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>{t("total")}</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
          </View>
        </SectionCard>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { paddingBottom: bottomInset + 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.confirmBtn,
            { backgroundColor: loading ? colors.mutedForeground : colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={placeOrder}
          disabled={loading}
        >
          <Text style={styles.confirmText}>{loading ? t("placingOrder") : t("confirmation")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SectionCard({ title, icon, children, colors }: { title: string; icon: any; children: React.ReactNode; colors: any }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Feather name={icon} size={16} color={colors.primary} />
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
      {children}
    </View>
  );
}

function Field({ label, value, onChangeText, colors, keyboardType, multiline }: {
  label: string; value: string; onChangeText: (t: string) => void; colors: any; keyboardType?: any; multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 2 : 1}
      />
    </View>
  );
}

function PayBtn({ label, icon, selected, onPress, colors }: any) {
  return (
    <Pressable
      style={[styles.payBtn, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : "transparent" }]}
      onPress={onPress}
    >
      <View style={[styles.payIcon, { backgroundColor: selected ? colors.primary : colors.muted }]}>
        <Feather name={icon} size={16} color={selected ? "#fff" : colors.mutedForeground} />
      </View>
      <Text style={[styles.payLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.border }]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 18, fontFamily: "Inter_700Bold" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cardDivider: { height: 1 },
  fieldWrap: { padding: 10, paddingHorizontal: 14, gap: 6 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  fieldInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular" },
  payBtn: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderWidth: 1.5, margin: 10, borderRadius: 12 },
  payIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  payLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  summaryItem: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 6 },
  summaryName: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", marginRight: 8 },
  summaryPrice: { fontSize: 13, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginVertical: 4, marginHorizontal: 14 },
  totalLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  totalValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  footer: { paddingHorizontal: 16 },
  confirmBtn: { paddingVertical: 18, borderRadius: 18, alignItems: "center" },
  confirmText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

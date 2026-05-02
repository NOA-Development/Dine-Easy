import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { Order, db_ops } from "@/lib/database";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("Abdullah");
  const [phone, setPhone] = useState("+1 555 000 0000");
  const [address, setAddress] = useState("123 Food Street, Flavor City");
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    AsyncStorage.getItem("user_name").then((n) => { if (n) setName(n); });
    AsyncStorage.getItem("user_phone").then((p) => { if (p) setPhone(p); });
    AsyncStorage.getItem("user_address").then((a) => { if (a) setAddress(a); });
    AsyncStorage.getItem("is_admin").then((v) => { setIsAdmin(v === "true"); });
    setOrders(db_ops.getOrders());
  }, []);

  async function saveProfile() {
    await AsyncStorage.setItem("user_name", name);
    await AsyncStorage.setItem("user_phone", phone);
    await AsyncStorage.setItem("user_address", address);
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function toggleAdmin(val: boolean) {
    setIsAdmin(val);
    await AsyncStorage.setItem("is_admin", val ? "true" : "false");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomInset + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
        <Pressable
          style={[styles.editBtn, { borderColor: colors.primary }]}
          onPress={() => editing ? saveProfile() : setEditing(true)}
        >
          <Text style={[styles.editText, { color: colors.primary }]}>
            {editing ? "Save" : "Edit"}
          </Text>
        </Pressable>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.avatarName, { color: colors.foreground }]}>{name}</Text>
        <Text style={[styles.avatarSub, { color: colors.mutedForeground }]}>{phone}</Text>
      </View>

      {/* Info Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginHorizontal: 16 }]}>
        <ProfileField
          icon="user"
          label="Full Name"
          value={name}
          editing={editing}
          onChangeText={setName}
          colors={colors}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ProfileField
          icon="phone"
          label="Phone"
          value={phone}
          editing={editing}
          onChangeText={setPhone}
          colors={colors}
          keyboardType="phone-pad"
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <ProfileField
          icon="map-pin"
          label="Address"
          value={address}
          editing={editing}
          onChangeText={setAddress}
          colors={colors}
        />
      </View>

      {/* Admin Mode */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginHorizontal: 16, marginTop: 12 }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="settings" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.foreground }]}>Admin Mode</Text>
          </View>
          <Switch
            value={isAdmin}
            onValueChange={toggleAdmin}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
        {isAdmin && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => router.push("/admin/")}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="package" size={18} color={colors.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>Manage Menu</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          </>
        )}
      </View>

      {/* Order History */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order History</Text>
        {orders.length === 0 ? (
          <Text style={[styles.noOrders, { color: colors.mutedForeground }]}>No orders yet.</Text>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.orderHeader}>
                <Text style={[styles.orderId, { color: colors.foreground }]}>Order #{order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.statusText, { color: colors.primary }]}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.orderFooter}>
                <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>{formatDate(order.created_at)}</Text>
                <Text style={[styles.orderTotal, { color: colors.primary }]}>${order.total.toFixed(2)}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function ProfileField({
  icon,
  label,
  value,
  editing,
  onChangeText,
  colors,
  keyboardType,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  editing: boolean;
  onChangeText: (t: string) => void;
  colors: any;
  keyboardType?: any;
}) {
  return (
    <View style={styles.fieldRow}>
      <View style={[styles.fieldIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
        {editing ? (
          <TextInput
            style={[styles.fieldInput, { color: colors.foreground, borderColor: colors.border }]}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
          />
        ) : (
          <Text style={[styles.fieldValue, { color: colors.foreground }]}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  editBtn: { borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  editText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  avatarSection: { alignItems: "center", paddingVertical: 24, gap: 6 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "#fff", fontSize: 28, fontFamily: "Inter_700Bold" },
  avatarName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  avatarSub: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  divider: { height: 1 },
  fieldRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 2 },
  fieldValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  fieldInput: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  noOrders: { fontSize: 14, fontFamily: "Inter_400Regular" },
  orderCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  orderFooter: { flexDirection: "row", justifyContent: "space-between" },
  orderDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  orderTotal: { fontSize: 15, fontFamily: "Inter_700Bold" },
});

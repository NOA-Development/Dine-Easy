import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

import { EmptyState } from "@/components/EmptyState";
import { MenuItem, db_ops } from "@/lib/database";
import { getFoodImage } from "@/lib/images";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [items, setItems] = useState<MenuItem[]>([]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  useFocusEffect(
    useCallback(() => {
      setItems(db_ops.getAllMenuItems());
    }, [])
  );

  function toggleAvailability(id: number, current: number) {
    const next = current !== 1;
    db_ops.toggleItemAvailability(id, next);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_available: next ? 1 : 0 } : i)));
  }

  function deleteItem(id: number) {
    Alert.alert(t("deleteItem"), t("deleteConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: () => {
          db_ops.deleteMenuItem(id);
          setItems((prev) => prev.filter((i) => i.id !== id));
        },
      },
    ]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("manageMenuTitle")}</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: bottomInset + 90 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="package" title={t("noMenuItems")} subtitle={t("addFirstItem")} />}
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemCard,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: item.is_available ? 1 : 0.6 },
            ]}
          >
            <Image source={getFoodImage(item.image_key)} style={styles.itemImg} contentFit="cover" />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.foreground }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
              <View style={styles.itemActions}>
                <Switch
                  value={item.is_available === 1}
                  onValueChange={() => toggleAvailability(item.id, item.is_available)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
                <Pressable
                  onPress={() => router.push({ pathname: "/admin/add-item", params: { itemId: item.id.toString() } })}
                  hitSlop={8}
                >
                  <Feather name="edit-2" size={18} color={colors.mutedForeground} />
                </Pressable>
                <Pressable onPress={() => deleteItem(item.id)} hitSlop={8}>
                  <Feather name="trash-2" size={18} color={colors.destructive} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={[styles.fab, { backgroundColor: colors.primary, bottom: bottomInset + 24 }]}>
        <Pressable
          style={({ pressed }) => [styles.fabInner, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.push("/admin/add-item")}
        >
          <Feather name="plus" size={22} color="#fff" />
          <Text style={styles.fabText}>{t("addItem")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  itemCard: { flexDirection: "row", borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  itemImg: { width: 80, height: 80 },
  itemInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  itemName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  itemPrice: { fontSize: 13, fontFamily: "Inter_700Bold" },
  itemActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  fab: {
    position: "absolute", right: 20, borderRadius: 20,
    shadowColor: "#FF6B00", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  fabInner: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 20, gap: 8 },
  fabText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

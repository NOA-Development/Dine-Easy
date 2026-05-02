import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { CategoryChip } from "@/components/CategoryChip";
import { MenuItemCard } from "@/components/MenuItemCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { Category, MenuItem, db_ops } from "@/lib/database";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";
import { useAdmin } from "@/context/AdminContext";

export default function CategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLanguage();
  const { isAdmin } = useAdmin();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      setCategories(db_ops.getCategories());
      // In admin mode show ALL items (including unavailable); in user mode only available
      const items = db_ops.getAllMenuItems();
      setAllItems(isAdmin ? items : items.filter((i) => i.is_available === 1));
    }, [isAdmin])
  );

  function handleEdit(item: MenuItem) {
    router.push({ pathname: "/admin/add-item", params: { itemId: item.id.toString() } });
  }

  function handleDelete(item: MenuItem) {
    db_ops.deleteMenuItem(item.id);
    setAllItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  function handleToggleAvailable(item: MenuItem) {
    const next = item.is_available !== 1;
    db_ops.toggleItemAvailability(item.id, next);
    setAllItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: next ? 1 : 0 } : i))
    );
  }

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (selectedCategory !== null) {
      items = items.filter((i) => i.category_id === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, selectedCategory, search]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const allChip: Category = { id: -1, name: t("allCategory"), icon: "🍽️" };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topInset + 12 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {isAdmin ? t("manageMenuTitle") : t("categories")}
          </Text>
          {isAdmin && (
            <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
              <Feather name="settings" size={12} color="#fff" />
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>

        {isAdmin && (
          <View style={[styles.adminHint, { backgroundColor: colors.secondary, borderColor: colors.primary + "44" }]}>
            <Feather name="info" size={13} color={colors.primary} />
            <Text style={[styles.adminHintText, { color: colors.primary }]} numberOfLines={2}>
              {t("adminBanner")}
            </Text>
          </View>
        )}

        <SearchBar value={search} onChangeText={setSearch} placeholder={t("searchMenu")} />

        <FlatList
          horizontal
          data={[allChip, ...categories]}
          keyExtractor={(c) => c.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          renderItem={({ item }) => (
            <CategoryChip
              category={item}
              selected={item.id === -1 ? selectedCategory === null : selectedCategory === item.id}
              onSelect={() =>
                setSelectedCategory(item.id === -1 ? null : selectedCategory === item.id ? null : item.id)
              }
            />
          )}
        />
      </View>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={isAdmin ? "package" : "coffee"}
          title={t("noItemsFound")}
          subtitle={isAdmin ? t("addFirstItem") : t("tryDifferentCat")}
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomInset + (isAdmin ? 100 : 50) }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.col}>
              <MenuItemCard
                item={item}
                adminMode={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleAvailable={handleToggleAvailable}
              />
            </View>
          )}
        />
      )}

      {/* Admin FAB */}
      {isAdmin && (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: colors.primary, bottom: bottomInset + 24, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push("/admin/add-item")}
        >
          <Feather name="plus" size={22} color="#fff" />
          <Text style={styles.fabText}>{t("addNewItem")}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  adminBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
  },
  adminBadgeText: { color: "#fff", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  adminHint: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 10, borderRadius: 12, borderWidth: 1,
  },
  adminHintText: { flex: 1, fontSize: 12, fontFamily: "Inter_500Medium" },
  listContent: { paddingHorizontal: 12 },
  row: { gap: 12, marginBottom: 12 },
  col: { flex: 1 },
  fab: {
    position: "absolute", right: 20,
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#FF6B00", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryChip } from "@/components/CategoryChip";
import { MenuItemCard } from "@/components/MenuItemCard";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { Category, MenuItem, db_ops } from "@/lib/database";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

export default function CategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCategories(db_ops.getCategories());
    setAllItems(db_ops.getAllMenuItems().filter((i) => i.is_available === 1));
  }, []);

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

  const allChip: Category = { id: -1, name: t("allCategory"), icon: "🍽️" };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>{t("categories")}</Text>
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
        <EmptyState icon="coffee" title={t("noItemsFound")} subtitle={t("tryDifferentCat")} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.col}>
              <MenuItemCard item={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  listContent: { paddingHorizontal: 12, paddingBottom: 100 },
  row: { gap: 12, marginBottom: 12 },
  col: { flex: 1 },
});

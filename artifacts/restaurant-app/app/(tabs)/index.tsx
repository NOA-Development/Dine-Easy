import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { MenuItemCard } from "@/components/MenuItemCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryChip } from "@/components/CategoryChip";
import { EmptyState } from "@/components/EmptyState";
import { useCart } from "@/context/CartContext";
import { Category, MenuItem, db_ops } from "@/lib/database";
import { HERO_BANNER } from "@/lib/images";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    AsyncStorage.getItem("onboarding_done").then((val) => {
      if (!val) router.replace("/onboarding");
    });
    AsyncStorage.getItem("user_name").then((n) => {
      if (n) setUserName(n);
    });
    loadData();
  }, []);

  function loadData() {
    setCategories(db_ops.getCategories());
    setAllItems(db_ops.getAllMenuItems().filter((i) => i.is_available === 1));
    setPopularItems(db_ops.getPopularItems());
  }

  function onRefresh() {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 500);
  }

  const displayedItems = useMemo(() => {
    let items = allItems;
    if (searchQuery.trim()) {
      return db_ops.searchMenuItems(searchQuery).filter((i) => i.is_available === 1);
    }
    if (selectedCategory !== null) {
      items = items.filter((i) => i.category_id === selectedCategory);
    }
    return items;
  }, [allItems, searchQuery, selectedCategory]);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Hello, {userName} 👋
          </Text>
          <Text style={[styles.headline, { color: colors.foreground }]}>
            What would you{"\n"}like to eat?
          </Text>
        </View>
        <Pressable
          style={[styles.cartBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <Feather name="shopping-cart" size={20} color="#fff" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      {!searchQuery && (
        <>
          {/* Hero Banner */}
          <Pressable
            style={[styles.banner, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/categories")}
          >
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Our Best Sellers!</Text>
              <Text style={styles.bannerSub}>
                Loved by thousands, now it's your turn!
              </Text>
              <View style={styles.bannerBtn}>
                <Text style={[styles.bannerBtnText, { color: colors.primary }]}>Order now</Text>
              </View>
            </View>
            <Image source={HERO_BANNER} style={styles.bannerImg} contentFit="cover" />
          </Pressable>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Categories</Text>
            <Pressable onPress={() => router.push("/(tabs)/categories")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See more</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={categories}
            keyExtractor={(c) => c.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <CategoryChip
                category={item}
                selected={selectedCategory === item.id}
                onSelect={() =>
                  setSelectedCategory(selectedCategory === item.id ? null : item.id)
                }
              />
            )}
          />

          {/* Popular */}
          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Popular Meals</Text>
            <Pressable onPress={() => { setSelectedCategory(null); }}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </View>

          <FlatList
            horizontal
            data={popularItems}
            keyExtractor={(m) => m.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => <MenuItemCard item={item} horizontal />}
          />
        </>
      )}

      {/* Items Grid */}
      <View style={[styles.sectionHeader, { marginTop: 20 }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {searchQuery ? `Results for "${searchQuery}"` : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name ?? "Menu" : "All Meals"}
        </Text>
      </View>

      {displayedItems.length === 0 ? (
        <EmptyState icon="search" title="No meals found" subtitle="Try a different search or browse categories" />
      ) : (
        <View style={styles.grid}>
          {displayedItems.map((item, idx) => (
            <View key={item.id} style={styles.gridItem}>
              <MenuItemCard item={item} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular", marginBottom: 4 },
  headline: { fontSize: 24, fontFamily: "Inter_700Bold", lineHeight: 32 },
  cartBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#FF6B00" },
  searchWrap: { paddingHorizontal: 16, marginBottom: 16 },
  banner: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    height: 140,
    marginBottom: 20,
  },
  bannerText: { flex: 1, padding: 16, justifyContent: "center", gap: 4 },
  bannerTitle: { color: "#fff", fontSize: 17, fontFamily: "Inter_700Bold" },
  bannerSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "Inter_400Regular" },
  bannerBtn: {
    marginTop: 8,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  bannerBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  bannerImg: { width: 130, height: "100%" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  gridItem: { width: "47%", marginBottom: 4 },
});

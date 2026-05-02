import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollViewCompat } from "react-native-keyboard-controller";

import { Category, db_ops } from "@/lib/database";
import { getFoodImage, IMAGE_KEYS } from "@/lib/images";
import { useColors } from "@/hooks/useColors";

export default function AddItemScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const isEdit = !!itemId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("20-30 min");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageKey, setImageKey] = useState("burger");
  const [isPopular, setIsPopular] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    const cats = db_ops.getCategories();
    setCategories(cats);
    if (cats.length > 0) setCategoryId(cats[0].id);

    if (isEdit && itemId) {
      const item = db_ops.getMenuItemById(Number(itemId));
      if (item) {
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price.toString());
        setPrepTime(item.prep_time);
        setCategoryId(item.category_id);
        setImageKey(item.image_key);
        setIsPopular(item.is_popular === 1);
      }
    }
  }, [itemId]);

  function save() {
    if (!name.trim() || !price.trim() || !categoryId) return;
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return;

    const itemData = {
      category_id: categoryId,
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      image_key: imageKey,
      rating: 4.5,
      prep_time: prepTime.trim(),
      is_popular: isPopular ? 1 : 0,
      is_available: 1,
    };

    if (isEdit && itemId) {
      db_ops.updateMenuItem(Number(itemId), itemData);
    } else {
      db_ops.addMenuItem(itemData);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isEdit ? "Edit Item" : "Add Item"}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: bottomInset + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image selection */}
        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>Photo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {IMAGE_KEYS.map((key) => (
              <Pressable
                key={key}
                style={[
                  styles.imgOption,
                  {
                    borderColor: imageKey === key ? colors.primary : colors.border,
                    borderWidth: imageKey === key ? 2.5 : 1,
                  },
                ]}
                onPress={() => setImageKey(key)}
              >
                <Image source={getFoodImage(key)} style={styles.imgThumb} contentFit="cover" />
                {imageKey === key && (
                  <View style={[styles.imgCheck, { backgroundColor: colors.primary }]}>
                    <Feather name="check" size={10} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <FormField label="Item Name *" value={name} onChangeText={setName} placeholder="e.g. Jumbo Burger" colors={colors} />
        <FormField label="Description" value={description} onChangeText={setDescription} placeholder="Short description..." colors={colors} multiline />
        <FormField label="Price *" value={price} onChangeText={setPrice} placeholder="0.00" colors={colors} keyboardType="decimal-pad" />
        <FormField label="Prep Time" value={prepTime} onChangeText={setPrepTime} placeholder="20-30 min" colors={colors} />

        {/* Category */}
        <View>
          <Text style={[styles.label, { color: colors.foreground }]}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: categoryId === cat.id ? colors.primary : colors.card,
                    borderColor: categoryId === cat.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setCategoryId(cat.id)}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catLabel, { color: categoryId === cat.id ? "#fff" : colors.foreground }]}>
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular toggle */}
        <Pressable
          style={[styles.toggleRow, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={() => setIsPopular(!isPopular)}
        >
          <Text style={[styles.toggleLabel, { color: colors.foreground }]}>Mark as Popular</Text>
          <View
            style={[
              styles.toggleBox,
              { backgroundColor: isPopular ? colors.primary : colors.muted, borderColor: isPopular ? colors.primary : colors.border },
            ]}
          >
            {isPopular && <Feather name="check" size={14} color="#fff" />}
          </View>
        </Pressable>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { paddingBottom: bottomInset + 16 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={save}
        >
          <Text style={styles.saveBtnText}>{isEdit ? "Save Changes" : "Add to Menu"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FormField({
  label, value, onChangeText, placeholder, colors, keyboardType, multiline,
}: {
  label: string; value: string; onChangeText: (t: string) => void; placeholder?: string;
  colors: any; keyboardType?: any; multiline?: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card },
          multiline && { height: 80, textAlignVertical: "top" },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  imgOption: { borderRadius: 14, overflow: "hidden", marginRight: 10, position: "relative" },
  imgThumb: { width: 80, height: 80 },
  imgCheck: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
    borderWidth: 1.5,
    marginRight: 8,
    gap: 6,
  },
  catIcon: { fontSize: 16 },
  catLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  toggleLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  toggleBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { paddingHorizontal: 16 },
  saveBtn: { paddingVertical: 18, borderRadius: 18, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

export default function OrderSuccessScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { t } = useLanguage();

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.1, duration: 400, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t("orderPlaced")}</Text>
      </View>

      <View style={styles.center}>
        <Animated.View style={[styles.successCircle, { backgroundColor: colors.primary, transform: [{ scale }] }]}>
          <Text style={styles.emoji}>🎉</Text>
        </Animated.View>

        <Animated.View style={{ opacity, alignItems: "center", gap: 12 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>{t("congratulations")}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t("orderConfirmed")}</Text>
          {orderId && (
            <View style={[styles.orderBadge, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.orderBadgeText, { color: colors.primary }]}>{t("orderNum")}{orderId}</Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: bottomInset + 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.homeBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          onPress={() => router.replace("/(tabs)/")}
        >
          <Feather name="home" size={18} color="#fff" />
          <Text style={styles.homeBtnText}>{t("backToHome")}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.profileBtn, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
          onPress={() => router.replace("/(tabs)/profile")}
        >
          <Text style={[styles.profileBtnText, { color: colors.foreground }]}>{t("viewOrders")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { alignItems: "center", paddingBottom: 8 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 28 },
  successCircle: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 52 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  orderBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginTop: 4 },
  orderBadgeText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  footer: { paddingHorizontal: 16, gap: 10 },
  homeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 17, borderRadius: 18, gap: 10 },
  homeBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
  profileBtn: { paddingVertical: 14, borderRadius: 18, alignItems: "center", borderWidth: 1.5 },
  profileBtnText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});

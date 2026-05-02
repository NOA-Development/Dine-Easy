import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HERO_BANNER } from "@/lib/images";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const slides = [
    { id: "1", title: t("slide1Title"), subtitle: t("slide1Sub"), image: HERO_BANNER, bg: "#FF6B00" },
    { id: "2", title: t("slide2Title"), subtitle: t("slide2Sub"), image: HERO_BANNER, bg: "#FF8C38" },
    { id: "3", title: t("slide3Title"), subtitle: t("slide3Sub"), image: HERO_BANNER, bg: "#FFA055" },
  ];

  async function finish() {
    await AsyncStorage.setItem("onboarding_done", "true");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)/");
  }

  function next() {
    if (currentIndex < slides.length - 1) {
      const nextIdx = currentIndex + 1;
      flatRef.current?.scrollToIndex({ index: nextIdx });
      setCurrentIndex(nextIdx);
    } else {
      finish();
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.imageContainer, { backgroundColor: item.bg }]}>
              <Image source={item.image} style={styles.slideImage} contentFit="cover" />
              <View style={styles.imageOverlay} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? colors.primary : colors.border,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.btnRow}>
          <Pressable
            style={({ pressed }) => [styles.skipBtn, { opacity: pressed ? 0.6 : 1 }]}
            onPress={finish}
          >
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>{t("skip")}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={next}
          >
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? t("getStarted") : t("next")}
            </Text>
          </Pressable>
        </View>
      </View>

      {Platform.OS === "web" && <View style={{ height: 34 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: { flex: 1 },
  imageContainer: { height: 360, overflow: "hidden" },
  slideImage: { width: "100%", height: "100%", opacity: 0.85 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },
  textContainer: { paddingHorizontal: 28, paddingTop: 36, gap: 12 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", lineHeight: 36 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22 },
  footer: { paddingHorizontal: 24, gap: 24 },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  btnRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 20 },
  skipText: { fontSize: 15, fontFamily: "Inter_500Medium" },
  nextBtn: { flex: 1, marginLeft: 16, paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  nextText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

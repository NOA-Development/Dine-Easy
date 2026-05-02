import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { type Lang, type TranslationKeys, t as translate } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    AsyncStorage.getItem("app_language").then((stored) => {
      if (stored === "en" || stored === "ru") setLangState(stored);
    });
  }, []);

  async function setLang(newLang: Lang) {
    setLangState(newLang);
    await AsyncStorage.setItem("app_language", newLang);
  }

  function t(key: TranslationKeys): string {
    return translate(lang, key);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

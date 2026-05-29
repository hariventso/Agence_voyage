/**
 * @file TranslationContext.jsx
 * @description Contexte global pour gérer l'état de la langue et le cache en mémoire
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { translateText } from "./translateApi";
import { TranslationContext } from "./TranslationContextValue";

export const TranslationProvider = ({ children }) => {
  const supportedLangs = ["fr", "en", "ru"];

  const getInitialLang = () => {
    const savedLang = localStorage.getItem("app_lang");
    if (savedLang && supportedLangs.includes(savedLang)) return savedLang;

    const navLang = navigator.language.split("-")[0];
    return supportedLangs.includes(navLang) ? navLang : "fr";
  };

  const [currentLanguage, setCurrentLanguage] = useState(getInitialLang);
  const [translations, setTranslations] = useState({});
  const prevLang = useRef(currentLanguage);
  const pendingRequests = useRef(new Set());

  useEffect(() => {
    localStorage.setItem("app_lang", currentLanguage);
    if (prevLang.current !== currentLanguage) {
      prevLang.current = currentLanguage;
      setTranslations({});
      pendingRequests.current.clear();
    }
  }, [currentLanguage]);

  const requestTranslation = useCallback(
    (text, sourceLang = "fr") => {
      if (!text || currentLanguage === sourceLang) return;
      if (translations[text] || pendingRequests.current.has(text)) return;

      pendingRequests.current.add(text);

      translateText(text, currentLanguage, sourceLang)
        .then((translated) => {
          setTranslations((prev) => ({ ...prev, [text]: translated }));
          pendingRequests.current.delete(text);
        })
        .catch(() => {
          pendingRequests.current.delete(text);
        });
    },
    [currentLanguage, translations],
  );

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        translations,
        requestTranslation,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

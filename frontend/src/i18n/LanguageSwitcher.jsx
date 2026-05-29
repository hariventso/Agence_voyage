/**
 * @file LanguageSwitcher.jsx
 * @description Sélecteur UI de langue élégant avec styles inline premium et interactifs
 */
import { useContext, useState, useRef, useEffect } from "react";
import { TranslationContext } from "./TranslationContextValue";
import { Globe, ChevronDown } from "lucide-react";

export const LanguageSwitcher = () => {
  const { currentLanguage, setCurrentLanguage } =
    useContext(TranslationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [hoveredLang, setHoveredLang] = useState(null);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  const activeLang =
    languages.find((l) => l.code === currentLanguage) || languages[0];

  // Fermer le menu lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Styles inline dynamisés
  const styles = {
    container: {
      position: "relative",
      display: "inline-block",
      fontFamily: "inherit",
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: btnHovered
        ? "rgba(255, 140, 0, 0.15)"
        : "rgba(128, 128, 128, 0.1)",
      border: btnHovered
        ? "1px solid rgba(255, 140, 0, 0.3)"
        : "1px solid rgba(128, 128, 128, 0.2)",
      padding: "6px 14px",
      borderRadius: "20px",
      cursor: "pointer",
      color: btnHovered ? "#FF8C00" : "inherit",
      fontFamily: "inherit",
      fontWeight: "600",
      fontSize: "13px",
      transition: "all 0.3s ease",
      outline: "none",
      height: "38px",
    },
    chevron: {
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    },
    dropdown: {
      position: "absolute",
      right: "0",
      marginTop: "8px",
      width: "160px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow:
        "0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)",
      border: "1px solid rgba(0, 0, 0, 0.06)",
      padding: "6px 0",
      zIndex: 1050,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      animation: "fadeInUp 0.2s ease-out",
    },
    item: (langCode) => {
      const isActive = currentLanguage === langCode;
      const isHovered = hoveredLang === langCode;

      return {
        width: "100%",
        textAlign: "left",
        padding: "10px 16px",
        fontSize: "14px",
        fontWeight: isActive ? "600" : "500",
        fontFamily: "inherit",
        border: "none",
        background: isActive
          ? "linear-gradient(135deg, rgba(255, 140, 0, 0.12), rgba(255, 69, 0, 0.05))"
          : isHovered
            ? "rgba(0, 0, 0, 0.03)"
            : "transparent",
        color: isActive ? "#FF8C00" : "#333333",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        transition: "all 0.2s ease",
      };
    },
    flag: {
      fontSize: "16px",
      lineHeight: "1",
    },
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Injecter l'animation d'ouverture dans le document */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={styles.button}
        aria-label="Changer la langue"
      >
        <Globe size={16} />
        <span>{activeLang.code.toUpperCase()}</span>
        <ChevronDown size={12} style={styles.chevron} />
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLanguage(lang.code);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHoveredLang(lang.code)}
              onMouseLeave={() => setHoveredLang(null)}
              style={styles.item(lang.code)}
            >
              <span style={styles.flag}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    Eng: {
      translation: require("./en.json"),
    },
    Amh: {
      translation: require("./am.json"),
    },
  },
  lng: "Eng",
  fallbackLng: "Eng",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n.use(LanguageDetector).use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to our website!",
          description: "This is a description.",
          hello: "Hello, %{name}!",
          wind_speed: "Wind speed"
      
        },
      },
      he: {
        translation: {
          welcome: "ברוכים הבאים לאתר שלנו!",
          description: "זוהי תיאור.",
          hello: "שלום, %{name}!",
          wind_speed: "מהירות הרוח"
        },
      },
    },
    lng: 'he', 
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;

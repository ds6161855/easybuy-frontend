import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 🔥 Translation Resources
const resources = {
  en: {
    translation: {
      common: {
        save: "Save",
        cancel: "Cancel",
        loading: "Loading..."
      },

      language: {
        title: "Select Language",
        description: "Choose your preferred language for browsing EasyBuy."
      },

      orders: {
        title: "My Orders",
        active: "Active Orders",
        history: "Order History",
        payNow: "Pay Now",
        cancelOrder: "Cancel Order",
        invoice: "Download Invoice"
      },

      navbar: {
        search: "Search for products, brands and more",
        login: "Login",
        seller: "Become a Seller",
        more: "More",
        profile: "My Profile",
        orders: "Orders",
        wallet: "Saved Cards & Wallet",
        language: "Select Language",
        privacy: "Privacy Center",
        terms: "Terms & Policies",
        logout: "Logout"
      },

      menu: {
        notifications: "Notification Preferences",
        customerCare: "24x7 Customer Care",
        advertise: "Advertise",
        download: "Download App"
      }
    }
  },

  hi: {
    translation: {
      common: {
        save: "सेव करें",
        cancel: "रद्द करें",
        loading: "लोड हो रहा है..."
      },

      language: {
        title: "भाषा चुनें",
        description: "EasyBuy के लिए अपनी पसंदीदा भाषा चुनें"
      },

      orders: {
        title: "मेरे ऑर्डर",
        active: "सक्रिय ऑर्डर",
        history: "पिछले ऑर्डर",
        payNow: "अभी भुगतान करें",
        cancelOrder: "ऑर्डर रद्द करें",
        invoice: "इनवॉइस डाउनलोड करें"
      },

      navbar: {
        search: "प्रोडक्ट, ब्रांड और अन्य खोजें",
        login: "लॉगिन",
        seller: "विक्रेता बनें",
        more: "और",
        profile: "मेरी प्रोफाइल",
        orders: "ऑर्डर",
        wallet: "सेव्ड कार्ड और वॉलेट",
        language: "भाषा चुनें",
        privacy: "प्राइवेसी सेंटर",
        terms: "नियम और शर्तें",
        logout: "लॉगआउट"
      },

      menu: {
        notifications: "नोटिफिकेशन सेटिंग्स",
        customerCare: "24x7 कस्टमर केयर",
        advertise: "विज्ञापन",
        download: "ऐप डाउनलोड करें"
      }
    }
  }
};

// 🔥 Detect language (priority)
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem("lang");
  if (savedLang) return savedLang;

  const browserLang = navigator.language.split("-")[0];
  return ["en", "hi"].includes(browserLang) ? browserLang : "en";
};

// 🔥 Init
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "en",

    debug: false,

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
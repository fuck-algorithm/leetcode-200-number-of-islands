import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en';
import zhTranslation from './locales/zh';

// 加载localStorage中保存的语言设置
const savedLanguage = localStorage.getItem('language');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    fallbackLng: 'zh',
    lng: savedLanguage || 'zh', // 使用保存的语言或默认中文
    interpolation: {
      escapeValue: false
    }
  });

// 当语言变更时，更新HTML的lang属性
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  localStorage.setItem('language', lng);
});

// 初始设置HTML的lang属性
document.documentElement.lang = i18n.language;

export default i18n; 
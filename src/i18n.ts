import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cn from './locales/cn.json';
import en from './locales/en.json';
const resources = {
  cn: {
    translation: cn,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  .init({
    // 初始化
    resources, // 本地多语言数据
    lng: localStorage.getItem('locale') || 'cn',
    fallbackLng: 'en',
  });

export default i18n;

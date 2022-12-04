import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cn from './locales/cn.json';
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndyX3poYW5nMjUiLCJpZCI6IjYzODE5NTEzZDY0NzVhMmFmMzM4MDQ1YSIsInJvbGVzIjpbXSwiaWF0IjoxNjY5NDM2NjkxLCJleHAiOjE5ODUwMTI2OTF9.qw8DYdq3VA-Gt978MFFmfnBRi8ZxKM3a2eu76ZcQvEU')
const resources = {
  cn: {
    translation: cn,
  },
  en: {
    translation: en,
  },
  ko: {
    translation: ko,
  },
  ja: {
    translation: ja,
  },
};

i18n
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  .init({
    // 初始化
    resources, // 本地多语言数据
    lng: localStorage.getItem('locale') || 'en',
    fallbackLng: 'en',
  });

export default i18n;

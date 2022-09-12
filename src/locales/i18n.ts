import i18n from 'i18next';
// i18next-browser-languagedetector插件
// 这是一个 i18next 语言检测插件，用于检测浏览器中的用户语言，
// 详情请访问：https://github.com/i18next/i18next-browser-languageDetector
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import cnJson from './cn.json';
import enJson from './en.json';

const resources = {
  'zh-CN': cnJson,
  'en-US': enJson,
};

i18n
  .use(LanguageDetector) // 嗅探当前浏览器语言 zh-CN
  .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
  .init({
    // 初始化
    resources, // 本地多语言数据
    lng: localStorage.getItem('i18nextLng') || 'en-US',
    fallbackLng: 'en',
  });

export default i18n;

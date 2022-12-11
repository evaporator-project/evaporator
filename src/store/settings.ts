import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const defaultSettings: SettingsState = {
  syncCollections: true,
  syncHistory: true,
  syncEnvironments: true,
  PROXY_ENABLED: false,
  PROXY_URL: 'http://proxy.evaporator.rico.org.cn/',
  EXTENSIONS_ENABLED: true,
  URL_EXCLUDES: {
    auth: true,
    httpUser: true,
    httpPassword: true,
    bearerToken: true,
    oauth2Token: true,
  },
  THEME_COLOR: 'indigo',
  BG_COLOR: 'system',
  TELEMETRY_ENABLED: true,
  EXPAND_NAVIGATION: true,
  SIDEBAR: true,
  SIDEBAR_ON_LEFT: true,
  ZEN_MODE: false,
  FONT_SIZE: 'small',
  COLUMN_LAYOUT: true,
};

type SettingsState = {
  syncCollections: boolean;
  syncHistory: boolean;
  syncEnvironments: boolean;

  PROXY_ENABLED: boolean;
  PROXY_URL: string;
  EXTENSIONS_ENABLED: boolean;
  URL_EXCLUDES: {
    auth: boolean;
    httpUser: boolean;
    httpPassword: boolean;
    bearerToken: boolean;
    oauth2Token: boolean;
  };
  THEME_COLOR: any;
  BG_COLOR: any;
  TELEMETRY_ENABLED: boolean;
  EXPAND_NAVIGATION: boolean;
  SIDEBAR: boolean;
  SIDEBAR_ON_LEFT: boolean;
  ZEN_MODE: boolean;
  FONT_SIZE: any;
  COLUMN_LAYOUT: boolean;
};

type Meth = {
  setInterceptor: (type: any, payload?: any) => void;

  setProxyUrl: (PROXY_URL: string) => void;
};

// TODO 回来操作，按模块整合，把其他设置也按照这个方法
export const useSettingsStore = create(
  immer<SettingsState & Meth>((set, get) => ({
    ...defaultSettings,
    // 设置拦截器
    setInterceptor: (type, payload?) => {
      if (type === 'EXTENSIONS_ENABLED') {
        set({ EXTENSIONS_ENABLED: true });
        set({ PROXY_ENABLED: false });
      } else if (type === 'PROXY_ENABLED') {
        set({ PROXY_ENABLED: true });
        set({ EXTENSIONS_ENABLED: false });
      } else if (type === 'BROWSER_ENABLED') {
        set({ EXTENSIONS_ENABLED: false });
        set({ PROXY_ENABLED: false });
      }
    },
    setProxyUrl: (PROXY_URL) => {
      set({ PROXY_URL });
    },
  }))
);

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('SettingsStore', useSettingsStore);
}

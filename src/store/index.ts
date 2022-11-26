import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

type BaseState = {
  userInfo: any;
  setUserInfo: (s: any) => void;
  pages: any[];
  setPages: () => void;
  accentColor: string;
  setAccentColor: (s: string) => void;
  language: string;
  setLanguage: (s: string) => void;
};

/**
 * TODO 全局store模块拆分
 * 1. 用户信息，用户配置等相关
 * 2. 主菜单/工作区（MainBox）相关
 * 3. ......
 */
export const useStore = create(
  immer<BaseState>((set, get) => ({
    userInfo: {
      username: '',
      nickname: '',
      avatar: '',
      email: '',
      role: [],
    },
    setUserInfo: (userInfo) => {
      set({ userInfo: userInfo });
    },
    pages: [],
    setPages: () => {
      console.log(123);
    },
    accentColor: '',
    setAccentColor: (accentColor) => {
      set({ accentColor });
    },
    language: '',
    setLanguage: (language) => {
      set({ language });
    },
  }))
);

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

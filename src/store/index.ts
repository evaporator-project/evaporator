import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

type BaseState = {
  pages: any[];
  setPages: () => void;
  colorPrimary: string;
  setColorPrimary: (s: string) => void;
};

/**
 * TODO 全局store模块拆分
 * 1. 用户信息，用户配置等相关
 * 2. 主菜单/工作区（MainBox）相关
 * 3. ......
 */
export const useStore = create(
  immer<BaseState>((set, get) => ({
    pages: [],
    setPages: () => {
      console.log(123);
    },
    colorPrimary: '',
    setColorPrimary: (colorPrimary) => {
      set({ colorPrimary });
    },
  }))
);

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

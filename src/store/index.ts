import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { MenuTypeEnum, PageTypeEnum } from '../constant';
// TODO 数据结构待规范
export type PaneType = {
  title: string;
  key: string;
  menuType?: MenuTypeEnum;
  // page就是pane
  pageType: PageTypeEnum;
  isNew?: boolean;
};
type BaseState = {
  userInfo: any;
  setUserInfo: (s: any) => void;
  pages: any[];
  setPages: () => void;
  accentColor: string;
  setAccentColor: (s: string) => void;
  language: string;
  setLanguage: (s: string) => void;
  activeMenu: [MenuTypeEnum, string | undefined]; // [菜单id, 菜单项目id]
  setActiveMenu: (menuKey: MenuTypeEnum, menuItemKey?: string) => void;
  panes: PaneType[];

  requestType: string;
  setRequestType: (s: string) => void;

  /*
   * 修改工作区标签页数据
   * @param panes 工作区标签页数据
   * @param mode 添加模式：push，替换模式：undefined
   * */
  setPanes: (panes: PaneType | PaneType[], mode?: 'push') => void;
  collectionTreeData: any;
  setCollectionTreeData: (collectionTreeData: any) => void;

  environments: any[];
  setEnvironments: (environments: any) => void;

  activeEnvironment: any;
  setActiveEnvironment: (activeEnvironment: any) => void;
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
    activeMenu: [MenuTypeEnum.Collection, undefined],
    setActiveMenu: (menuKey, menuItemKey) => {
      set({ activeMenu: [menuKey, menuItemKey] });
    },
    panes: [],
    setPanes: (panes, mode) => {
      if (!mode) {
        set({ panes: panes as PaneType[] });
      }

      if (mode === 'push') {
        // immer push new pane and set activePane
        const pane = panes as PaneType;
        set((state) => {
          if (!state.panes.find((i) => i.key === pane.key)) {
            state.panes.push(pane);
          }
          // state.activePane = pane.key;
        });
      }
    },
    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),

    environments: [],
    setEnvironments: (environments) => set({ environments }),

    activeEnvironment: 'No environment',
    setActiveEnvironment: (activeEnvironment) => set({ activeEnvironment }),
    requestType: '',
    setRequestType: (requestType) => set({ requestType }),
  }))
);

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

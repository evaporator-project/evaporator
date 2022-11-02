import { toggleTheme } from '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils';
import { set } from 'husky';
import React from 'react';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { Environment } from '../data/environment';
import DefaultConfig from '../defaultConfig';
import { PrimaryColor, ThemeClassify, ThemeName } from '../style/theme';
const u = {
  _id: '6361d92af827a4adc24fabac',
  username: 'tzhangm',
  password: '123456',
  nickname: 'zt张涛',
  avatar: 'http://git.dev.sh.ctripcorp.com/uploads/-/system/user/avatar/8417/avatar.png',
  thRefreshToken: '2f9378d27ed5456682a4da6bed0b557bc03163f18c340007be593fcf8e3f1916',
  thAccessToken: 'dbd48abbb07828be5f8d3625c39fa6d925f11b69ab9bc52b0c09d54f86f10be9',
  email: 'tzhangm@trip.com',
  thId: '8417',
  role: [],
  createdAt: '2022-11-02T02:42:50.262Z',
  __v: 0,
};
type UserInfo = {
  username: string;
  nickname: string;
  avatar: string;
  thRefreshToken: string;
  thAccessToken: string;
  email: string;
  thId: string;
  role: string[];
  profile: {
    background: string;
    accentColor: string;
    fontSize: string;
    language: string;
  };
};

// TODO 数据结构待规范
export type PaneType = {
  title: string;
  key: string;
  menuType?: MenuTypeEnum;
  pageType: PageTypeEnum;
  isNew?: boolean;
};

type BaseState = {
  settingModalOpen: boolean;
  setSettingModalOpen: (settingModalOpen: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (settingModalOpen: boolean) => void;

  themeClassify: ThemeClassify;
  changeTheme: (theme?: ThemeName) => void;

  extensionInstalled: boolean;
  userInfo?: UserInfo;
  logout: () => void;

  activePane: string;
  setActivePane: (key: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  activeMenu: [MenuTypeEnum, string | undefined]; // [菜单id, 菜单项目id]
  setActiveMenu: (menuKey: MenuTypeEnum, menuItemKey?: string) => void;
  panes: PaneType[];

  /*
   * 修改工作区标签页数据
   * @param panes 工作区标签页数据
   * @param mode 添加模式：push，替换模式：undefined
   * */
  setPanes: (panes: PaneType | PaneType[], mode?: 'push') => void;
  resetPanes: () => void;
  collectionTreeData: any;
  setCollectionTreeData: (collectionTreeData: any) => void;

  workspaces: any[];
  setWorkspaces: (workspaces: any[]) => void;

  environmentTreeData: any;
  setEnvironmentTreeData: (environmentTreeData: any) => void;

  environment: Environment[];
  setEnvironment: (environment: Environment[]) => void;

  activeEnvironment?: Environment;
  setActiveEnvironment: (environment: Environment | string) => void;
};

/**
 * TODO 全局store模块拆分
 * 1. 用户信息，用户配置等相关
 * 2. 主菜单/工作区（MainBox）相关
 * 3. ......
 */

export const useStore = create(
  immer<BaseState>((set, get) => ({
    settingModalOpen: false,
    setSettingModalOpen: (settingModalOpen) => set({ settingModalOpen }),
    profileModalOpen: false,
    setProfileModalOpen: (profileModalOpen) => set({ profileModalOpen }),

    userInfo: {
      email: localStorage.getItem('email'),
      profile: {
        background: 'light',
        accentColor: '#603BE3',
        fontSize: 'small',
        language: 'english',
      },
    },
    setUserInfo: (userInfo: BaseState['userInfo']) => set({ userInfo }),

    extensionInstalled: false,

    themeClassify: DefaultConfig.themeClassify,
    changeTheme: (theme) => {
      set((state) => {
        const newTheme = theme;
        const themeName = newTheme as ThemeName;
        toggleTheme({
          scopeName: newTheme,
        });
        state.themeClassify = themeName.split('-')[0] as ThemeClassify;
      });
    },

    activePane: '',
    setActivePane: (key: string) => {
      set({ activePane: key });
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
          state.activePane = pane.key;
        });
      }
    },
    activeMenu: [MenuTypeEnum.Collection, undefined],
    setActiveMenu: (menuKey, menuItemKey) => {
      set({ activeMenu: [menuKey, menuItemKey] });
    },
    resetPanes: () => {
      set({ panes: [], activePane: '', activeMenu: [MenuTypeEnum.Collection, undefined] });
    },

    logout: () => {
      localStorage.removeItem('email');
      set({ userInfo: undefined, panes: [], activePane: '' });
    },

    collectionTreeData: [],
    setCollectionTreeData: (collectionTreeData) => set({ collectionTreeData }),

    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),

    environmentTreeData: [],
    setEnvironmentTreeData: (environmentTreeData) => set({ environmentTreeData }),

    environment: [
    ],
    setEnvironment: (environment) => set({ environment }),
    activeEnvironment: 'dev',
    setActiveEnvironment: (activeEnvironment) => set({ activeEnvironment }),
    currentEnvironment: '0',
    setCurrentEnvironment: (currentEnvironment) => set({ currentEnvironment }),
  })),
);

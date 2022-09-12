import React, { FC, PropsWithChildren } from 'react';

export type PropsWithChildrenOnly = PropsWithChildren<unknown>;
export type ReactFCWithChildren = React.FC<PropsWithChildrenOnly>;

declare global {
  interface Window {
    __AREX_EXTENSION_INSTALLED__: boolean; // 是否安装了arex-chrome-extension
  }
}

interface NodeList {
  id: string;
  children: NodeList[];
  title: string;
  key: string;
  nodeType: number;
}

import { AliasToken } from 'antd/es/theme/interface';

export const darkTheme: Partial<AliasToken> = {
  colorBorder: '#eee',
};

export const lightTheme: Partial<AliasToken> = {
  colorBorder: 'skyblue',
};

const primaryColor = '#00b96b';
export const themeLight = {
  color: {
    primary: primaryColor,
    active: '#f5f5f5',
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.9)',
      secondary: 'rgba(0,0,0,0.7)',
      disabled: 'rgba(0,0,0,0.3)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: primaryColor,
    },
    border: {
      primary: '#F0F0F0',
    },
    background: {
      primary: '#ffffff',
      active: '#fafafa',
      hover: '#eee',
    },
  },
};
export const themeDark = {
  color: {
    primary: primaryColor,
    active: 'rgba(255, 255, 255, 0.08)',
    success: '#2e7d32',
    info: '#0288d1',
    warning: '#ed6c02',
    error: '#d32f2f',
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      watermark: 'rgba(255, 255, 255, 0.1)',
      highlight: primaryColor,
    },
    border: {
      primary: '#303030',
    },
    background: {
      primary: '#202020',
      active: '#FFFFFF0A',
      hover: '#444',
    },
  },
};

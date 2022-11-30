import { ThemeProvider } from '@emotion/react';
import { theme } from 'antd';
import { useState } from 'react';
import { useRoutes } from 'react-router-dom';

import routerConfig from '../router';
const { useToken } = theme;
const ThemeMidProv = () => {
  const routesContent = useRoutes(routerConfig);
  const token = useToken();

  const [emotionTheme, setEmotionTheme] = useState({});

  return (
    <div>
      <ThemeProvider theme={token.token}>{routesContent}</ThemeProvider>
    </div>
  );
};

export default ThemeMidProv;

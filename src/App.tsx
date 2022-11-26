import { css, ThemeProvider } from '@emotion/react';
import { useMount } from 'ahooks';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import useDarkMode from './hooks/use-dark-mode';
import routerConfig from './router';
import {useStore} from "./store";
const { darkAlgorithm } = theme;

function App() {
  useMount(() => {
    fetch('/api/vi/health').then((res) => {
      console.log(res);
    });
  });
  const routesContent = useRoutes(routerConfig);
  const theme1 = {};
  // 明亮、黑暗主题
  const darkMode = useDarkMode();
    const {accentColor} = useStore()
  return (
    <div>
      {/*antd全剧配置*/}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: accentColor,
          },
          // 黑暗主题
          algorithm: darkMode.value ? [darkAlgorithm] : [],
        }}
      >
        <ThemeProvider theme={theme1}>{routesContent}</ThemeProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;

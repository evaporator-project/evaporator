import { css, ThemeProvider } from '@emotion/react';
import { useMount } from 'ahooks';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

import { HttpProvider } from './components/arex-request';
import useDarkMode from './hooks/use-dark-mode';
import routerConfig from './router';
import { useStore } from './store';
import {darkTheme, lightTheme, themeDark, themeLight} from './theme';
const { darkAlgorithm } = theme;
const mockEnvironmentData = {
  envName: 'dev',
  keyValues: [
    {
      key: 'id',
      value: '45',
    },
  ],
};

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
  const { accentColor } = useStore();
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
        <ThemeProvider theme={darkMode.value ? {...darkTheme,...themeDark} : {...lightTheme,...themeLight}}>
          <HttpProvider
            collectionTreeData={[]}
            environment={mockEnvironmentData}
          >
            {routesContent}
          </HttpProvider>
        </ThemeProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;

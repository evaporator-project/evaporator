import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';

import useDarkMode from './hooks/use-dark-mode';
import ThemeMiddlewareProvider from './theme/ThemeMiddlewareProvider';
const { darkAlgorithm, useToken } = theme;

const App = () => {
  // 明亮、黑暗主题
  const darkMode = useDarkMode();

  const token = useToken();

  return (
    <div>
      <ConfigProvider>
        <ThemeMiddlewareProvider />
      </ConfigProvider>
    </div>
  );
};

export default App;

import { ConfigProvider, theme } from 'antd';

import useDarkMode from './hooks/use-dark-mode';
import { useStore } from './store';
import ThemeMiddlewareProvider from './theme/ThemeMiddlewareProvider';
const { darkAlgorithm, useToken } = theme;

const App = () => {
  // 明亮、黑暗主题
  const darkMode = useDarkMode();
  const { accentColor } = useStore();
  const token = useToken();
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: accentColor,
            colorBorder: token.token.colorSplit,
          },
          algorithm: darkMode.value ? [darkAlgorithm] : [],
        }}
      >
        <ThemeMiddlewareProvider />
      </ConfigProvider>
    </div>
  );
};

export default App;

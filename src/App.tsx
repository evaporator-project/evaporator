import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';

import useDarkMode from './hooks/use-dark-mode';
import { useStore } from './store';
import MainProvider from './store/content/SettingContent';
import ThemeMiddlewareProvider from './theme/ThemeMiddlewareProvider';
const { darkAlgorithm, useToken } = theme;

const App = () => {
  // 明亮、黑暗主题
  const darkMode = useDarkMode();
  const { accentColor } = useStore();
  const token = useToken();

  useEffect(() => {
    function promisePoller() {
      function request1(p1) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({ taskId: '123' });
          }, 1000);
        });
      }

      function request2(p2) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const num = Math.random();
            const r = num > 0.8 ? true : false;
            resolve({ success: r });
          }, 1000);
        });
      }

      const params1 = {};
      // 1.定义大Promise
      return new Promise((resolve, reject) => {
        request1(params1).then((res1) => {
          const { taskId } = res1;
          // 2.设置定时器
          const timer = setInterval(() => {
            request2({ taskId }).then((res2) => {
              console.log(timer, 'timer');
              // 3.判断是否成功
              if (res2.success) {
                // 成功清除定时器
                //   resolve结果
                clearInterval(timer);
                resolve({ msg: '成功' });
              } else {
                // 失败继续
                console.log('失败，再来一次');
              }
            });
          }, 2000);
        });
      });
    }
    promisePoller().then((res) => {
      console.log({ res });
    });
  }, []);
  return (
    <MainProvider>
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
    </MainProvider>
  );
};

export default App;

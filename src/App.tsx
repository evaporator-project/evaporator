import 'antd/dist/antd.less';
import './style/index.less';

import { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import { HttpProvider } from './components/ArexRequestComponent/lib';
import routerConfig from './routers';
import { useStore } from './store';
function App() {

  // 主题检测
  const themeMedia = window.matchMedia("(prefers-color-scheme: light)")
  const { collectionTreeData, currentEnvironment, environment,changeTheme,themeClassify } = useStore();
  if (themeMedia.matches) {
    changeTheme('light-purple');
  } else {
    changeTheme('dark-purple');
  }

  // 默认语言检测
  console.log(navigator.language)

  const useRoutesRouterConfig = useRoutes(routerConfig);
  // console.log(environment,'environment',environment[currentEnvironment - 1],'environment[currentEnvironment - 1]')

  const env = useMemo(() => {
    try {
      const envObj = environment[currentEnvironment - 1];
      return {
        envsName: envObj.name,
        keyValues: envObj.variables,
      };
    } catch (e) {
      return {
        envsName: 'no',
        keyValues: [],
      };
    }
  }, [environment, currentEnvironment]);

  return (
    <HttpProvider
      locale={'en'}
      theme={themeClassify}
      collectionTreeData={collectionTreeData}
      environment={env}
    >
      {useRoutesRouterConfig}
    </HttpProvider>
  );
}

export default App;

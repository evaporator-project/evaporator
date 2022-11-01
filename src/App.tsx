import 'antd/dist/antd.less';
import './style/index.less';

import { useRoutes } from 'react-router-dom';

import { HttpProvider } from './components/ArexRequestComponent/lib';
import routerConfig from './routers';
import { useStore } from './store';
function App() {
  const { collectionTreeData } = useStore();
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return (
    <HttpProvider
      locale={'en'}
      theme={'light'}
      collectionTreeData={collectionTreeData}
      environment={{
        id: '0',
        envName: 'dev',
        keyValues: [
          {
            key: 'base_url',
            value: 'http://127.0.0.1:8080',
          },
        ],
      }}
    >
      {useRoutesRouterConfig}
    </HttpProvider>
  );
}

export default App;

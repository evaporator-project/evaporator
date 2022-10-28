import { useRoutes } from 'react-router-dom';

import routerConfig from './routers';
import 'antd/dist/antd.less';
import './style/index.less';
import { HttpProvider } from './components/ArexRequestComponent/lib';
import { useStore } from './store';
function App() {
  const { collectionTreeData } = useStore();
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <HttpProvider locale={'en'} theme={'dark'} collectionTreeData={collectionTreeData}>{useRoutesRouterConfig}</HttpProvider>;
}

export default App;

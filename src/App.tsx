import { useRoutes } from 'react-router-dom';

import routerConfig from './routers';
import 'antd/dist/antd.less';
import './style/index.less';
function App() {
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <div>{useRoutesRouterConfig}</div>;
}

export default App;

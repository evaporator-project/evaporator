import { useRoutes } from 'react-router-dom';

import routerConfig from './routers';

function App() {
  const useRoutesRouterConfig = useRoutes(routerConfig);
  return <div>{useRoutesRouterConfig}</div>;
}

export default App;

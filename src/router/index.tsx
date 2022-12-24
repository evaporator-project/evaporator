import EditRedoc from '../pages/EditRedoc';
import Login from '../pages/login';
import MainBox from '../pages/MainBox';
import Redoc from '../pages/Redoc';
import Welcome from '../pages/welcome';
const router = [
  {
    path: '/',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:paneType/:paneId',
    element: <MainBox />,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/redoc',
    element: <Redoc />,
  },
  {
    path: '/editredoc',
    element: <EditRedoc />,
  },
];
export default router;

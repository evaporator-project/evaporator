import MainBox from '../layouts/MainBox';
import Detail from '../pages/Detail';
import Home from '../pages/Home';
import Welcome from "../pages/welcome";
import TestMonaco from "../pages/test/TestMonaco";

export default [
  {
    path: '/',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:paneType/:paneRawId',
    element: <MainBox />,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: 'testmonaco',
    element: <TestMonaco />,
  }
];

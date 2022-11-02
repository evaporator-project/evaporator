import MainBox from '../layouts/MainBox';
import TestCodemirror from '../pages/test/codemirrortest';
// import TestMonaco from '../pages/test/TestMonaco';
import Welcome from '../pages/welcome';
import Login from "../pages/Login";

export default [
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/login',
    element: <Login />,
  },
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
    path: '/test/codemirror',
    element: <TestCodemirror />,
  },
];

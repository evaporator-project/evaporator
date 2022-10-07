import MainBox from '../layouts/MainBox';
import TestCodemirror from '../pages/test/codemirrortest';
// import TestMonaco from '../pages/test/TestMonaco';
import Welcome from '../pages/welcome';

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
    path: '/test/codemirror',
    element: <TestCodemirror />,
  },
];

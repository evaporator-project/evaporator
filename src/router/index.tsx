import MainBox from '../pages/MainBox';
const router = [
  {
    path: '/',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:paneType/:paneId',
    element: <MainBox />,
  },
];
export default router;

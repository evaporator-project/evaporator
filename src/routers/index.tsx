import MainBox from '../layouts/MainBox';
import Detail from '../pages/Detail';
import Home from '../pages/Home';
import Welcome from "../pages/welcome";
import TestMonaco from "../pages/test/TestMonaco";

export default [
  {
    path: '/main',
    element: <MainBox />,
    children: [
      {
        path: 'Home',
        element: <Home />,
      },
    ],
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

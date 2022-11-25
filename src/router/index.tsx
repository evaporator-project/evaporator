import Login from '../pages/login';
import MainBox from '../pages/MainBox';
import Welcome from '../pages/welcome';

const router = [
  {
    path: '/',
    element: <MainBox />,
    auth: true,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/login',
    element: <Login />,
  },
];
export default router;

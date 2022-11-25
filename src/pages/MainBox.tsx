import { useMount } from 'ahooks';

import AppHeader from '../components/app/Header';

const MainBox = () => {
  useMount(() => {
    console.log(localStorage.getItem('token'));
  });
  return (
    <div>
      <AppHeader />
    </div>
  );
};

export default MainBox;

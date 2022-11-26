import { useMount } from 'ahooks';
import { useTranslation } from 'react-i18next';

import AppHeader from '../components/app/Header';
import useDarkMode from '../hooks/use-dark-mode';
import request from '../services/request';
import { useStore } from '../store';

const MainBox = () => {
  const { setUserInfo, setAccentColor,setLanguage } = useStore();
  const darkMode = useDarkMode();
  const { i18n } = useTranslation();
  useMount(() => {
    console.log(localStorage.getItem('token'));
    request({
      method: 'GET',
      url: '/api/user',
    }).then((res: any) => {
      console.log(res);
      setUserInfo(res);
      setAccentColor(res.settings.accentColor);
      darkMode.toggle(res.settings.colorMode === 'dark');
      setLanguage(res.settings.language)
      i18n.changeLanguage(res.settings.language);
    });
  });
  return (
    <div>
      <AppHeader />
    </div>
  );
};

export default MainBox;

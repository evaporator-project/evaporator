import { css } from '@emotion/react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import useDarkMode from '../../hooks/use-dark-mode';

const AppHeader = () => {
  const darkMode = useDarkMode();
  const { t } = useTranslation();
  return (
    <div
      css={css`
        height: 48px;
      `}
    >
      <Button onClick={() => darkMode.toggle(!darkMode.value)}>切换主题</Button>
      <p>语言：{t('action.clear')}</p>
    </div>
  );
};

export default AppHeader;

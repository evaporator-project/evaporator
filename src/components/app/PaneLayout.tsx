import { FC } from 'react';

const AppPaneLayout: FC<{ primary: any; secondary: any }> = ({ primary, secondary }) => {
  return (
    <div>
      {primary}
      {secondary}
    </div>
  );
};

export default AppPaneLayout;

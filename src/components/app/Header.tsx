import { SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Divider, Dropdown, Menu } from 'antd';
import React from 'react';

import useDarkMode from '../../hooks/use-dark-mode';
import { useStore } from '../../store';
// import { TooltipButton } from '../index';
// import InviteWorkspace from '../workspace/Invite';
import GitHubStarButton from './GitHubStarButton';
import Settings from "./settings";

const HeaderWrapper = styled.div`
  .app-header {
    height: 46px;
    padding: 7px;
    display: flex;
    justify-content: space-between;

    .left,
    .right {
      display: flex;
      align-items: center;
    }
    .app-name {
      width: 90px;
      text-align: center;
      font-weight: 600;
      display: inline-block;
      border-radius: 0.25rem;
      font-size: 14px;
      cursor: default;
    }
  }
`;

const AppHeader = () => {
  const darkMode = useDarkMode();

  const handleSetting = () => {
    console.log(123);
  };
  const handleLogout = () => {
    window.location.href = '/login';
  };
  return (
    <HeaderWrapper>
      <div className={'app-header'}>
        <div className={'left'}>
          <span className={'app-name'}>AREX</span>
          <GitHubStarButton theme={darkMode.value?'dark':'light'} />
        </div>

        <div className={'right'}>
          <Settings></Settings>
          <div />
          {/*<TooltipButton*/}
          {/*  icon={<SettingOutlined />}*/}
          {/*  title="Setting"*/}
          {/*  onClick={handleSetting}*/}
          {/*/>*/}

          <Dropdown
            overlayStyle={{ width: '170px' }}
            menu={{
              items: [
                {
                  key: 'signOut',
                  label: 'Sign Out',
                },
              ],
              onClick: (e) => {
                if (e.key === 'signOut') {
                  handleLogout();
                }
              },
            }}
          >
            <Avatar size={20} style={{ marginLeft: '8px', cursor: 'pointer' }}>
              tzhangm
            </Avatar>
          </Dropdown>
        </div>
      </div>

      <Divider style={{ margin: '0' }} />
    </HeaderWrapper>
  );
};

export default AppHeader;

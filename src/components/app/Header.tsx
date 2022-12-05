import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuProps,
  Select,
  Space,
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import useDarkMode from '../../hooks/use-dark-mode';
import request from '../../services/request';
import { useStore } from '../../store';
// import { TooltipButton } from '../index';
// import InviteWorkspace from '../workspace/Invite';
import GitHubStarButton from './GitHubStarButton';
import Settings from './settings';

const HeaderWrapper = styled.div`
  .app-header {
    height: 48px;
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

const items: MenuProps['items'] = [
  {
    type: 'divider',
  },
  {
    label: (
      <Button
        type={'primary'}
        css={css`
          width: 100%;
        `}
      >
        创建
      </Button>
    ),
    key: '3',
  },
];

const AppHeader = () => {
  const { i18n } = useTranslation();
  const params = useParams();
  const darkMode = useDarkMode();
  const { userInfo,setWorkspaces } = useStore();
  const { t } = useTranslation();

  // const [workspaces, setWorkspaces] = useState([]);

  const {
    setUserInfo,
    setAccentColor,
    setLanguage,
    panes,
    setPanes,
    activeMenu,
    setActiveMenu,
    environments,
    setEnvironments,
    setActiveEnvironment,
    activeEnvironment,
    collectionTreeData,
    setRequestType,
  } = useStore();

  // const darkMode = useDarkMode();

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
      setLanguage(res.settings.language);
      i18n.changeLanguage(res.settings.language);
      // setSettings({
      //   s:res.settings.PROXY_ENABLED
      // })
      setRequestType(res.settings.EXTENSIONS_ENABLED);
    });

    request({
      method: 'POST',
      url: '/api/listworkspace',
    }).then((res: any) => {
      setEnvironments(
        res.find((r: any) => r._id === params.workspaceId).environments
      );

      setWorkspaces(res);
    });
  });

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
          <span className={'app-name'}>EVAPORATOR</span>
          <GitHubStarButton theme={darkMode.value ? 'dark' : 'light'} />
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
            <Avatar
              src={userInfo.avatar}
              size={20}
              style={{ marginLeft: '8px', cursor: 'pointer' }}
            ></Avatar>
          </Dropdown>
        </div>
      </div>

      <Divider style={{ margin: '0' }} />
    </HeaderWrapper>
  );
};

export default AppHeader;

import {
  DownOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Avatar, Button, Dropdown, Menu, Space } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../store';
import Setting from '../setting';
import SmartButton from '../smart/Button';
import HoverWrapper from '../smart/HoverWrapper';
import AppGitHubStarButton from './GitHubStarButton';
import testa from '../../assets/testa.jpeg'
type Props = {
  userinfo: any;
  workspaces: any[];
};

const RequesterHeader = styled.div`
  height: 48px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ededed;
  padding: 0 8px;
`;

const RequesterHeaderSectionLeft = styled.div`
  display: flex;
  align-items: center;
`;
const RequesterHeaderSectionRight = styled.div`
  display: flex;
  align-items: center;
`;
const TopNavigationButtons = styled.div`
  display: flex;
  align-items: center;
`;
const TopNavigationButton = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 6px;
`;
const DownOutlinedCx = styled(DownOutlined)`
  font-size: 10px;
`;
const AppHeader: FC<Props> = ({ userinfo, workspaces }) => {
  const _useNavigate = useNavigate();
  const { t } = useTranslation();
  const { settingModalOpen, setSettingModalOpen,setProfileModalOpen } = useStore();
  const SettingMenuItems = [
    {
      key: '1',
      label: <a>Setting</a>,
    },
    {
      key: '2',
      label: <a>Privacy Policy</a>,
    },
    {
      key: '3',
      label: <a>Terms</a>,
    },
  ];
  return (
    <>
      <RequesterHeader>
        <RequesterHeaderSectionLeft>
          <TopNavigationButtons>
            <TopNavigationButton>
              <HoverWrapper
                css={css`
                  padding: 0 6px;
                `}
              >
                <SmartButton>EVAPORATOR</SmartButton>
              </HoverWrapper>
            </TopNavigationButton>
            <TopNavigationButton>
              <AppGitHubStarButton />
            </TopNavigationButton>
            <TopNavigationButton>
              <HoverWrapper
                css={css`
                  padding: 0 6px;
                `}
              >
                <Dropdown
                  overlay={
                    <Menu
                      items={workspaces.map((workspace) => {
                        return {
                          key: workspace._id,
                          label: (
                            <Button
                              onClick={() => {
                                window.location.href = `/${workspace._id}/workspace/${workspace.name}`;
                              }}
                            >
                              {workspace.name}
                            </Button>
                          ),
                        };
                      })}
                    />
                  }
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      Workspaces
                      <DownOutlinedCx />
                    </Space>
                  </a>
                </Dropdown>
              </HoverWrapper>
            </TopNavigationButton>

          </TopNavigationButtons>
        </RequesterHeaderSectionLeft>
        <RequesterHeaderSectionRight>
          <Button style={{ marginRight: '8px' }} type={'primary'} icon={<UserAddOutlined />}>
            {t('app.invite')}
          </Button>

          <HoverWrapper
            css={css`
              padding: 0 6px;
              width: 32px;
              .anticon {
                display: block;
              }
            `}
          >
            <div onClick={() => setSettingModalOpen(true)}>
              <SettingOutlined style={{ color: '#6B6B6B', fontSize: '16px' }} />
            </div>
          </HoverWrapper>
          <HoverWrapper
            css={css`
              padding: 0 6px;
              width: 32px;
              .ant-avatar {
                display: block;
              }
            `}
          >
            <Dropdown
              trigger={['click']}
              overlay={
                <div
                  css={css`
                    background-color: white;
                  `}
                >
                  <Menu
                    items={[
                      {
                        key: '1',
                        label: (
                          <div>
                            <div>张涛</div>
                            <div css={css`color: #a3a3a3`}>zhangwen@136.com</div>
                          </div>
                        )
                      },
                      {
                        type:'divider'
                      },
                      {
                        key: '个人档案',
                        label: (
                          <a
                            onClick={() => {
                              setProfileModalOpen(true)
                            }}
                          >
                            个人档案
                          </a>
                        ),
                        icon: <UserOutlined />,
                      },
                      {
                        key: 'Sign Out',
                        label: (
                          <a
                            onClick={() => {
                              localStorage.removeItem('email');
                              // value.dispatch({ type: "login"})
                              // _useNavigate('/')
                              window.location.href = '/';
                            }}
                          >
                            Sign Out
                          </a>
                        ),
                        icon: <LogoutOutlined />,
                      },
                    ]}
                  />
                </div>
              }
            >
              <span onClick={(e) => e.preventDefault()}>
                <div>
                  <Avatar src={testa} size={20}>{userinfo.email}</Avatar>
                </div>
              </span>
            </Dropdown>
          </HoverWrapper>
        </RequesterHeaderSectionRight>
      </RequesterHeader>
    </>
  );
};

export default AppHeader;

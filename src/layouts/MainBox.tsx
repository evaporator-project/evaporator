import { ApiOutlined, DeploymentUnitOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMount, useRequest } from 'ahooks';
import { Allotment } from 'allotment';
import {
  Button,
  Col,
  Divider,
  Empty,
  Row,
  Select,
  SelectProps,
  TabPaneProps,
  Tabs,
  TabsProps,
} from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import AppFooter from '../components/app/Footer';
import AppHeader from '../components/app/Header';
import CollectionMenu from '../components/collection';
import EnvironmentMenu from '../components/environment';
import Environment from '../components/environment';
import EnvironmentPage from '../components/panes/Environment';
import FolderPage from '../components/panes/Folder';
import RequestPage from '../components/panes/Request';
import WorkspacePage from '../components/panes/Workspace';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import Profile from '../pages/profile';
import Settings from '../pages/settings';
import request from '../services/request';
import { useStore } from '../store';
import DraggableLayout from './DraggableLayout';

const { Option } = Select;
const { TabPane } = Tabs;
const MainMenu = styled(Tabs)`
  //height: 100%;
  flex: 1;
  .ant-tabs-nav-list {
    width: 100px;
    .ant-tabs-tab {
      margin: 0 !important;
      padding: 12px 0 !important;
      .ant-tabs-tab-btn {
        margin: 0 auto;
      }
    }
    // .ant-tabs-tab-active {
    // }
    .ant-tabs-ink-bar {
      left: 0;
    }
  }
  .ant-tabs-content {
    height: 100%;
  }
`;

type MainMenuItemProps = TabPaneProps & { menuItem: ReactNode };
const MainMenuItem = styled((props: MainMenuItemProps) => (
  <TabPane {...props}>{props.menuItem}</TabPane>
))<MainMenuItemProps>`
  padding: 0 8px !important;
  .ant-tree-node-selected {
  }
`;

type MenuTitleProps = { title: string; icon?: ReactNode };
const MenuTitle = styled((props: MenuTitleProps) => (
  <div {...props}>
    <i>{props.icon}</i>
    <span>{props.title}</span>
  </div>
))<MenuTitleProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  i {
    width: 14px;
    height: 24px;
  }
`;

const MainTabs = styled((props: TabsProps) => (
  <Tabs
    size='small'
    type='editable-card'
    tabBarGutter={-1}
    tabBarStyle={{
      left: '-11px',
      top: '-1px',
    }}
    {...props}
  >
    {props.children}
  </Tabs>
))<TabsProps>`
  height: 100%;
  .ant-tabs-tab-with-remove {
    padding: 6px 12px !important;
    // 添加高亮条 tabs-ink-bar
    // 注意当前的作用范围很广，目前的作用对象为工作区所有的可编辑可删除卡片式 Tab
    // .ant-tabs-tab-with-remove 类是为了避免污染一般的 Tabs
    &.ant-tabs-tab-active:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      transition: all 0.2s ease-in-out;
    }
    .ant-tabs-tab-remove {
      margin-left: 0;
      padding-right: 0;
    }
  }
  .ant-tabs-content-holder {
    overflow: auto;
  }
  .ant-tabs-nav-more {
    height: 36px;
    border-left: #000c17 1px solid;
  }
`;

const EnvironmentSelect = styled((props: SelectProps) => (
  <Select allowClear bordered={false} {...props} />
))`
  height: 36px;
  width: 150px;
  box-sizing: content-box;
  margin-left: -1px;
  .ant-select-selector {
    height: 100%;
    .ant-select-selection-item {
      line-height: 34px;
    }
  }
`;

const MainTabPane = styled((props: TabPaneProps) => (
  <TabPane {...props}>{props.children}</TabPane>
))<TabPaneProps>`
  padding: 0 8px;
  overflow: auto;
`;

const EmptyWrapper = styled(
  (props: { empty: boolean; emptyContent: ReactNode; children: ReactNode }) => {
    const { empty, emptyContent, children, ...restProps } = props;
    return <div {...restProps}>{empty ? <Empty>{emptyContent}</Empty> : children}</div>;
  },
)`
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const MainBox = () => {
  const nav = useNavigate();
  const params = useParams();
  const {
    panes,
    setPanes,
    activeMenu,
    setActiveMenu,
    environment,
    environmentTreeData,
    setEnvironment,
    setEnvironmentTreeData,
    setCollectionTreeData,
    setActiveEnvironment,
    activeEnvironment,
    setUserInfo,
    userInfo,
    setCurrentEnvironment,
    currentEnvironment,
  } = useStore();

  const [workspaces, setWorkspaces] = useState([]);

  useMount(() => {
    request({
      url: '/api/listworkspace',
      method: 'POST',
      data: {},
    }).then((res) => {
      setWorkspaces(res);
      const e = res.find((r) => r._id === params.workspaceId)?.environments || [];

      setEnvironment(e);
    });

    request({
      url: '/api/user',
      method: 'GET',
    }).then((res) => {
      // console.log(res);
      setUserInfo({
        username: res.username,
        nickname: res.nickname,
        avatar: res.avatar,
        thRefreshToken: res.thRefreshToken,
        thAccessToken: res.thAccessToken,
        email: res.email,
        thId: res.thId,
        role: [],
        profile: {
          background: '',
          accentColor: '',
          fontSize: '',
          language: '',
        },
      });
    });
  });

  // 必须和路由搭配起来，在切换的时候附着上去
  useEffect(() => {
    const findActivePane = panes.find((i) => i.key === activeMenu[1]);
    if (findActivePane) {
      nav(
        `/${params.workspaceId}/workspace/${params.workspaceName}/${findActivePane.pageType}/${findActivePane.key}`,
      );
    }
    // fetchEnvironmentData();
  }, [activeMenu, panes]);

  const { t } = useTranslation();

  const addTab = () => {
    const newActiveKey = String(Math.random());
    setPanes(
      {
        key: newActiveKey,
        title: 'New Request',
        pageType: PageTypeEnum.Request,
        menuType: MenuTypeEnum.Collection,
        isNew: true,
      },
      'push',
    );
  };

  const removeTab = (targetKey: string) => {
    const menuType = activeMenu[0];
    const filteredPanes = panes.filter((i) => i.key !== targetKey);
    setPanes(filteredPanes);

    if (filteredPanes.length) {
      const lastPane = filteredPanes[filteredPanes.length - 1];
      const lastKey = lastPane.key;
      setActiveMenu(lastPane.menuType || MenuTypeEnum.Collection, lastKey);
    } else {
      setActiveMenu(menuType);
    }
  };

  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };

  const handleTabsChange = (activePane: string) => {
    const pane = panes.find((i) => i.key === activePane);
    setActiveMenu(pane?.menuType || MenuTypeEnum.Collection, activePane);
  };

  const handleCollectionMenuClick = (key, node) => {
    setActiveMenu(MenuTypeEnum.Collection, key);
    setPanes(
      {
        key,
        title: node.title,
        menuType: MenuTypeEnum.Collection,
        pageType: node.nodeType === 3 ? PageTypeEnum.Folder : PageTypeEnum.Request,
        isNew: false,
      },
      'push',
    );
  };

  const handleEnvironmentMenuClick = (key, node) => {
    setActiveMenu(MenuTypeEnum.Environment, key);

    console.log(MenuTypeEnum.Environment, key);
    setPanes(
      {
        key,
        title: 'env',
        menuType: MenuTypeEnum.Environment,
        pageType: PageTypeEnum.Environment,
        isNew: false,
      },
      'push',
    );
  };

  const childRef = useRef();

  return (
    <>
      {/*AppHeader部分*/}
      <AppHeader workspaces={workspaces} userinfo={{}} />
      <div
        css={css`
          height: calc(100vh - 74px);
        `}
      >
        <Allotment>
          <Allotment.Pane preferredSize={500} minSize={400}>
            <div
              css={css`
                height: calc(100vh - 72px);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
              `}
            >
              {/*{JSON.stringify(userInfo)}*/}
              {/*<Row>*/}
              {/*  <Col span={18}>*/}
              {/*    EVAPORATOR*/}
              {/*  </Col>*/}
              {/*  <Col span={6} >*/}
              {/*    <Button>Import</Button>*/}
              {/*  </Col>*/}
              {/*</Row>*/}
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  padding: 10px;
                  border-bottom: 1px solid #eee;
                `}
              >
                <span></span>
                <Button size={'small'}>Import</Button>
              </div>
              <MainMenu
                tabPosition='left'
                activeKey={activeMenu[0]}
                onChange={(key) => setActiveMenu(key as MenuTypeEnum)}
                items={[
                  {
                    label: <MenuTitle icon={<ApiOutlined />} title={t('navigation.collection')} />,
                    key: MenuTypeEnum.Collection,
                    children: (
                      <CollectionMenu
                        cRef={childRef}
                        value={activeMenu[1]}
                        onSelect={handleCollectionMenuClick}
                      />
                    ),
                  },

                  {
                    label: <MenuTitle icon={<ApiOutlined />} title={'env'} />,
                    key: MenuTypeEnum.Environment,
                    children: (
                      <EnvironmentMenu
                        value={activeMenu[1]}
                        onSelect={handleEnvironmentMenuClick}
                      />
                    ),
                  },
                ]}
              ></MainMenu>
            </div>
          </Allotment.Pane>
          <Allotment.Pane snap>
            <div
              css={css`
                height: calc(100vh - 72px);
                overflow-y: auto;
              `}
            >
              <MainTabs
                onEdit={handleTabsEdit}
                activeKey={activeMenu[1]}
                onChange={handleTabsChange}
                tabBarExtraContent={
                  <EnvironmentSelect
                    value={currentEnvironment}
                    onChange={(e) => {
                      console.log(e, 'ssssssse');
                      console.log(environment);
                      setCurrentEnvironment(e);
                      // seAc
                    }}
                  >
                    <Option value='0'>No Environment</Option>
                    {environment?.map((e, index) => {
                      return (
                        <Option key={e.name} value={String(index + 1)}>
                          {e.name}
                        </Option>
                      );
                    })}
                  </EnvironmentSelect>
                }
              >
                {panes.map((pane) => (
                  <MainTabPane className='main-tab-pane' tab={pane.title} key={pane.key}>
                    {/* TODO 工作区自定义组件待规范，参考 menuItem */}
                    {pane.pageType === PageTypeEnum.Request && <RequestPage id={pane.key} />}
                    {pane.pageType === PageTypeEnum.Folder && <FolderPage />}
                    {pane.pageType === PageTypeEnum.Environment && <EnvironmentPage />}
                    {pane.pageType === PageTypeEnum.Workspace && <WorkspacePage />}
                  </MainTabPane>
                ))}
              </MainTabs>
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>

      {/*setting弹窗、profile弹窗*/}
      <Settings />
      <Profile />
      {/*<Button onClick={()=>setModalVisible(true)}>sss</Button>*/}
      <AppFooter />
    </>
  );
};

export default MainBox;

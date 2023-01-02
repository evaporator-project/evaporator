import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Select, Space, Tabs, theme } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import AppFooter from '../components/app/Footer';
import AppHeader from '../components/app/Header';
import DraggableTabs from '../components/DraggableTabs';
import CollectionMenu from '../components/menus/CollectionMenu';
import EnvironmentMenu from '../components/menus/EnvironmentMenu';
import EnvironmentPane from '../components/panes/EnvironmentPane';
import RequestPane from '../components/panes/RequestPane';
import WorkspacePane from '../components/panes/WorkspacePane';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { treeFind } from '../helpers/collection/util';
import { generateGlobalPaneId } from '../helpers/utils';
import useDarkMode from '../hooks/use-dark-mode';
import request from '../services/request';
import { MainContext } from '../store/content/MainContent';
const { useToken } = theme;
const MainBox = () => {
  const nav = useNavigate();
  const darkMode = useDarkMode();
  const { i18n, t } = useTranslation();

  const [workspaces, setWorkspaces] = useState([]);
  const params = useParams();
  useMount(() => {
    request({
      method: 'GET',
      url: '/api/user',
    }).then((res: any) => {
      // test

      dispatch((state) => {
        state.settings.LANGUAGE = res.settings.LANGUAGE;
        state.settings.THEME_COLOR = res.settings.THEME_COLOR;
        state.settings.BG_COLOR = res.settings.BG_COLOR;

        // state.settings.EXTENSIONS_ENABLED = res.settings.EXTENSIONS_ENABLED;
        // state.settings.PROXY_ENABLED = res.settings.PROXY_ENABLED;
        // state.settings.PROXY_URL = res.settings.PROXY_URL;
      });

      i18n.changeLanguage(res.settings.LANGUAGE);

      if (res.settings.BG_COLOR === 'dark') {
        darkMode.toggle(true);
      } else {
        darkMode.toggle(false);
      }
    });

    request({
      method: 'POST',
      url: '/api/listworkspace',
    }).then((res: any) => {
      console.log(res, 'resssss');
      setWorkspaces(res);

      if (params.workspaceId && res.length > 0) {
        dispatch((state) => {
          state.globalState.environments = res.find(
            (r: any) => r._id === params.workspaceId
          ).environments;
        });
        // console.log(res.find((r: any) => r._id === params.workspaceId).environments,'res.find((r: any) => r._id === params.workspaceId).environments')
      } else {
        location.href = `/${res[0]._id}/workspace/${res[0].name}/workspace/overview`;
      }
    });

    // console.log(params)

    if (params.workspaceId && params.paneType && params.paneId) {
      // ??
      const paneId = generateGlobalPaneId(
        MenuTypeEnum.Collection,
        params.paneType,
        params.paneId
      );
      console.log(paneId, params, 'ssssss');
      dispatch((state) => {
        state.globalState.activeMenu = [MenuTypeEnum.Collection, paneId];
      });
    }
  });
  const { dispatch, store } = useContext(MainContext);
  const {
    panes,
    activeMenu,
    activeEnvironment,
    environments,
    collectionTreeData,
  } = store.globalState;
  const { token } = useToken();
  const handleCollectionMenuClick = (key: any, node: any) => {
    // 点击Collection菜单
    // 生成paneId，根据菜单类型、页面类型
    const paneKey = generateGlobalPaneId(
      MenuTypeEnum.Collection,
      PageTypeEnum.Request,
      key
    );
    const pageType = [
      '',
      PageTypeEnum.Request,
      PageTypeEnum.Example,
      PageTypeEnum.Folder,
    ][node.nodeType];
    dispatch((state) => {
      // 修改当前激活菜单
      state.globalState.activeMenu = [MenuTypeEnum.Collection, paneKey];
      if (!state.globalState.panes.find((pane) => pane.key === paneKey)) {
        state.globalState.panes.push({
          key: paneKey,
          title: treeFind(collectionTreeData, (node: any) => node.key === key)
            ?.title,
          menuType: MenuTypeEnum.Collection,
          pageType: pageType,
          rawId: key,
        });
      }
    });
    nav(
      `/${params.workspaceId}/workspace/${params.workspaceName}/${pageType}/${key}`
    );
  };
  const handleEnvironmentMenuClick = (key: any, node: any) => {
    const paneKey = generateGlobalPaneId(
      MenuTypeEnum.Environment,
      PageTypeEnum.Environment,
      key
    );

    dispatch((state) => {
      state.globalState.activeMenu = [MenuTypeEnum.Environment, paneKey];
      if (!state.globalState.panes.find((pane) => pane.key === paneKey)) {
        state.globalState.panes.push({
          key: paneKey,
          title: node.title,
          menuType: MenuTypeEnum.Environment,
          pageType: PageTypeEnum.Environment,
          rawId: key,
        });
      }
    });
    nav(
      `/${params.workspaceId}/workspace/${params.workspaceName}/environment/${node.key}`
    );
  };
  const handleTabsChange = (activePane: string) => {
    const pane = panes.find((pane) => pane.key === activePane);
    dispatch((state) => {
      state.globalState.activeMenu = [
        pane?.menuType || MenuTypeEnum.Collection,
        activePane,
      ];
    });

    nav(
      `/${params.workspaceId}/workspace/${params.workspaceName}/${pane?.pageType}/${pane.rawId}`
    );
  };
  const handleTabsEdit: any = (targetKey: string, action: 'add' | 'remove') => {
    action === 'add' ? addTab() : removeTab(targetKey);
  };
  const removeTab = (targetKey: string) => {
    const menuType = activeMenu[0];
    const filteredPanes = panes.filter((i) => i.key !== targetKey);
    dispatch((state) => {
      state.globalState.panes = filteredPanes;
    });
    // setPanes(filteredPanes);
    if (filteredPanes.length) {
      const lastPane = filteredPanes[filteredPanes.length - 1];
      const lastKey = lastPane.key;
      // setActiveMenu(lastPane.menuType || MenuTypeEnum.Collection, lastKey);
      dispatch((state) => {
        // state.globalState.activeMenu = [MenuTypeEnum.Collection, key];
        state.globalState.activeMenu = [
          lastPane.menuType || MenuTypeEnum.Collection,
          lastKey,
        ];
      });
    } else {
      // setActiveMenu(menuType);
    }
  };
  const addTab = () => {
    console.log();
  };

  useEffect(() => {
    if (localStorage.getItem('activeEnvironment')) {
      dispatch((state) => {
        state.globalState.activeEnvironment = localStorage.getItem(
          'activeEnvironment'
        ) as string;
      });
    }
  }, []);

  return (
    <div>
      <AppHeader />
      <div
        css={css`
          height: calc(100vh - 82px);
        `}
      >
        <Allotment>
          <Allotment.Pane preferredSize={500} minSize={400}>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                height: 100%;
              `}
            >
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  padding: 7.5px;
                  border-bottom: 1px solid ${token.colorSplit};
                `}
              >
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <UserOutlined />
                  <Select
                    size={'small'}
                    value={params.workspaceId}
                    style={{ width: 160 }}
                    bordered={false}
                    options={workspaces.map((w: any) => ({
                      value: w._id,
                      label: w.name,
                    }))}
                    onSelect={(value, option) => {
                      location.href = `/${value}/workspace/${option.label}/workspace/overview`;
                    }}
                  />

                  <EditOutlined
                    css={css`
                      margin-left: 8px;
                      cursor: pointer;
                    `}
                    onClick={() => {
                      // setPanes(
                      //     {
                      //       key: 'newActiveKey',
                      //       title: 'New Request',
                      //       pageType: PageTypeEnum.Workspace,
                      //       menuType: MenuTypeEnum.Replay,
                      //       isNew: true,
                      //     },
                      //     'push'
                      // );
                      // dispatch

                      dispatch((state) => {
                        state.globalState.activeMenu = [
                          MenuTypeEnum.Collection,
                          'key',
                        ];

                        state.globalState.panes.push({
                          key: 'key',
                          title: '???',
                          menuType: MenuTypeEnum.Collection,
                          pageType: PageTypeEnum.Workspace,
                          isNew: false,
                        });
                      });
                      // nav(
                      //     `/${params.workspaceId}/workspace/${params.workspaceName}/request/${node.key}`
                      // );
                    }}
                  />
                </div>
                <Space>
                  {/*<AddWorkspace></AddWorkspace>*/}
                  <Button size={'small'} disabled>
                    Import
                  </Button>
                </Space>
              </div>

              <Tabs
                css={css`
                  flex: 1;
                  .ant-tabs-tabpane {
                    padding-left: 12px !important;
                  }
                `}
                tabPosition="left"
                activeKey={activeMenu[0]}
                onChange={(key) => {
                  dispatch((state) => {
                    state.globalState.activeMenu = [key, undefined];
                  });
                  //
                }}
                items={[
                  {
                    label: 'Collection',
                    key: MenuTypeEnum.Collection,
                    children: (
                      <CollectionMenu
                        value={activeMenu[1]}
                        onSelect={handleCollectionMenuClick}
                      />
                    ),
                  },
                  {
                    label: 'Environment',
                    key: MenuTypeEnum.Environment,
                    children: (
                      <EnvironmentMenu
                        value={activeMenu[1]}
                        onSelect={handleEnvironmentMenuClick}
                      />
                    ),
                  },
                ]}
              ></Tabs>
            </div>
          </Allotment.Pane>

          <Allotment.Pane>
            <div>
              <DraggableTabs
                onChange={(val) => {
                  console.log(val, 'va');
                  handleTabsChange(val);
                }}
                onEdit={handleTabsEdit}
                size="small"
                type="editable-card"
                tabBarGutter={-1}
                tabBarStyle={
                  {
                    // top: '-1px',
                    // marginBottom: '8px',
                  }
                }
                activeKey={activeMenu[1]}
                items={panes.map((pane, i) => {
                  const id = pane.key;
                  const title = pane.title;
                  if (pane.pageType === PageTypeEnum.Request) {
                    return {
                      forceRender: true,
                      label: title,
                      key: id,
                      children: pane.pageType === PageTypeEnum.Request && (
                        <RequestPane pane={pane} />
                      ),
                    };
                  } else if (pane.pageType === PageTypeEnum.Workspace) {
                    return {
                      forceRender: true,
                      label: title,
                      key: id,
                      children: pane.pageType === PageTypeEnum.Workspace && (
                        <WorkspacePane pane={pane} />
                      ),
                    };
                  } else if (pane.pageType === PageTypeEnum.Environment) {
                    return {
                      forceRender: true,
                      label: title,
                      key: id,
                      children: pane.pageType === PageTypeEnum.Environment && (
                        <EnvironmentPane pane={pane} />
                      ),
                    };
                  } else {
                    return {
                      label: title,
                      key: id,
                      children: <div>无</div>,
                    };
                  }
                })}
                tabBarExtraContent={
                  <Select
                    css={css`
                      border-left: 1px solid ${token.colorSplit};
                    `}
                    value={activeEnvironment}
                    bordered={false}
                    style={{
                      width: '180px',
                      padding: '4px',
                      marginRight: '10px',
                    }}
                    options={[
                      { label: 'No environment', value: 'No environment' },
                    ].concat(
                      environments.map((env) => ({
                        label: env.name,
                        value: env.name,
                      }))
                    )}
                    onSelect={(value) => {
                      dispatch((state) => {
                        state.globalState.activeEnvironment = value;
                      });
                      localStorage.setItem('activeEnvironment', value);
                    }}
                  />
                }
              />
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
      <AppFooter />
    </div>
  );
};

export default MainBox;

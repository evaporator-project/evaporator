import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Allotment } from 'allotment';
import { Button, Select, Space, Tabs } from 'antd';
import { theme } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import AppFooter from '../components/app/Footer';
import AppHeader from '../components/app/Header';
import DraggableTabs from '../components/DraggableTabs';
import CollectionMenu from '../components/menus/CollectionMenu';
import EnvironmentMenu from '../components/menus/EnvironmentMenu';
import RequestPane from '../components/panes/RequestPane';
import WorkspacePane from '../components/panes/WorkspacePane';
import AddWorkspace from '../components/workspace/Add';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { treeFind } from '../helpers/collection/util';
import { useStore } from '../store';

const { useToken } = theme;
const MainBox = () => {
  const { token } = useToken();
  const nav = useNavigate();
  const {
    panes,
    setPanes,
    activeMenu,
    setActiveMenu,
    environments,
    setActiveEnvironment,
    activeEnvironment,
    collectionTreeData,
    workspaces,
  } = useStore();
  const params = useParams();

  const handleTabsChange = (activePane: string) => {
    const pane = panes.find((i) => i.key === activePane);
    setActiveMenu(pane?.menuType || MenuTypeEnum.Collection, activePane);
  };
  const addTab = () => {
    console.log();
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

  const handleCollectionMenuClick = (key: any, node: any) => {
    setActiveMenu(MenuTypeEnum.Collection, key);
    setPanes(
      {
        key,
        title: treeFind(collectionTreeData, (node: any) => node.key === key)
          ?.title,
        menuType: MenuTypeEnum.Collection,
        pageType:
          node.nodeType === 3 ? PageTypeEnum.Folder : PageTypeEnum.Request,
        isNew: false,
      },
      'push'
    );
    nav(
      `/${params.workspaceId}/workspace/${params.workspaceName}/request/${node.key}`
    );
  };
  const handleEnvironmentMenuClick = (key: any, node: any) => {
    setActiveMenu(MenuTypeEnum.Environment, key);
  };
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
                      setPanes(
                        {
                          key: 'newActiveKey',
                          title: 'New Request',
                          pageType: PageTypeEnum.Workspace,
                          menuType: MenuTypeEnum.Replay,
                          isNew: true,
                        },
                        'push'
                      );
                    }}
                  />
                </div>
                <Space>
                  <AddWorkspace></AddWorkspace>
                  <Button size={'small'} disabled>
                    Import
                  </Button>
                </Space>
              </div>

              <Tabs
                css={css`
                  flex: 1;
                `}
                tabPosition="left"
                activeKey={activeMenu[0]}
                onChange={(key) => setActiveMenu(key as MenuTypeEnum)}
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
                onChange={handleTabsChange}
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
                  } else {
                    return {
                      label: title,
                      key: id,
                      children: <div>你好</div>,
                    };
                  }
                })}
                tabBarExtraContent={
                  <Select
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
                      setActiveEnvironment(value);
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

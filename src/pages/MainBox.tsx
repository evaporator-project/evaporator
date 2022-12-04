import { css, useTheme } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import { Button, Select, Tabs } from 'antd';
import { theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import AppFooter from '../components/app/Footer';
import AppHeader from '../components/app/Header';
import DraggableTabs from '../components/DraggableTabs';
import CollectionMenu from '../components/menus/CollectionMenu';
import EnvironmentMenu from '../components/menus/EnvironmentMenu';
import RequestPane from '../components/panes/RequestPane';
import { MenuTypeEnum, PageTypeEnum } from '../constant';
import { treeFind } from '../helpers/collection/util';
import useDarkMode from '../hooks/use-dark-mode';
import request from '../services/request';
import { useStore } from '../store';

const { TabPane } = Tabs;
const { useToken } = theme;
const MainBox = () => {
  const theme: any = useTheme();
  const { token } = useToken();
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

  const darkMode = useDarkMode();
  const { i18n } = useTranslation();
  const params = useParams();
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
    });
  });

  const handleTabsChange = (activePane: string) => {
    const pane = panes.find((i) => i.key === activePane);
    setActiveMenu(pane?.menuType || MenuTypeEnum.Collection, activePane);
  };

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
      'push'
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
                  padding: 10px;
                  border-bottom: 1px solid ${token.colorBorder};
                `}
              >
                <span></span>
                <Button size={'small'}>Import</Button>
              </div>

              <Tabs
                  css={css`flex: 1`}
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
                  } else {
                    return {
                      label: title,
                      key: id,
                      children: 'hi',
                    };
                  }
                })}
                tabBarExtraContent={
                  <Select
                    value={activeEnvironment}
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

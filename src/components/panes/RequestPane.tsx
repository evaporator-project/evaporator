import { css, jsx } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Breadcrumb, message, theme } from 'antd';
import { FC, useContext, useMemo } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';

import { treeFind, treeFindPath } from '../../helpers/collection/util';
import { AgentAxiosAndTest } from '../../helpers/request';
// import Http from './../../components/http'
// import { AgentAxiosAndTest } from '../../helpers/request';
import useDarkMode from '../../hooks/use-dark-mode';
import request from '../../services/request';
import { MainContext } from '../../store/content/MainContent';
// import { useStore } from '../../store';
// import { useSettingsStore } from '../../store/settings';
import Http from '../http';
// import {SettingContext} from "../../store/content/SettingContent";
const { useToken } = theme;
const HttpBreadcrumb: FC<{ nodePaths: { title: string }[] }> = ({
  nodePaths,
}) => {
  console.log(nodePaths, 'nodePaths');
  return (
    <div>
      <Breadcrumb>
        {nodePaths.map((nodePath, index) => (
          <Breadcrumb.Item key={index}>{nodePath.title}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};
const RequestPane: FC<any> = ({ pane }) => {
  const { store } = useContext(MainContext);
  const { token } = useToken();
  const { collectionTreeData, activeEnvironment, environments } =
    store.globalState;
  const { PROXY_URL, EXTENSIONS_ENABLED, PROXY_ENABLED } = store.settings;
  const interceptorSelection = useMemo(() => {
    if (PROXY_ENABLED === false && EXTENSIONS_ENABLED === false) {
      return 'BROWSER_ENABLED';
    } else if (PROXY_ENABLED === true && EXTENSIONS_ENABLED === false) {
      return 'PROXY_ENABLED';
    } else if (PROXY_ENABLED === false && EXTENSIONS_ENABLED === true) {
      return 'EXTENSIONS_ENABLED';
    } else {
      return 'BROWSER_ENABLED';
    }
  }, [PROXY_ENABLED, EXTENSIONS_ENABLED]);
  const darkMode = useDarkMode();
  const { relationshipRequestId } = treeFind(
    collectionTreeData,
    (node: any) => node.key === pane.key
  );
  const nodePaths = treeFindPath(
    collectionTreeData,
    (node: any) => node.key === pane.key
  );
  const mockEnvironmentData = useMemo(() => {
    return (
      environments.find((env) => env.name === activeEnvironment) || {
        variables: [],
      }
    );
  }, [environments, activeEnvironment]);

  const { data } = useRequest(
    () =>
      request({
        method: 'POST',
        url: '/api/retrieverequest',
        data: {
          id: relationshipRequestId,
        },
      }),
    {
      onSuccess(res) {
        console.log(res);
      },
    }
  );

  return (
    <div
      css={css`
        height: calc(100vh - 140px);
      `}
    >
      <Http
        breadcrumb={<HttpBreadcrumb nodePaths={nodePaths} />}
        // @ts-ignore
        value={data}
        // @ts-ignore
        theme={store.settings.BG_COLOR}
        environment={mockEnvironmentData}
        onSave={(p) => {
          console.log(p);
          request({
            url: '/api/updaterequest',
            method: 'POST',
            data: {
              ...p,
              id: relationshipRequestId,
            },
          }).then((res) => {
            message.success(JSON.stringify(res));
          });
        }}
        onSend={(req) => {
          return AgentAxiosAndTest({ request: req });
        }}
      />
    </div>
  );
};

export default RequestPane;

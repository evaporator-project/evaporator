import { css, jsx } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Breadcrumb, message, theme } from 'antd';
import { FC, useMemo } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';

import { treeFind } from '../../helpers/collection/util';
// import Http from './../../components/http'
import { AgentAxiosAndTest } from '../../helpers/request';
import useDarkMode from '../../hooks/use-dark-mode';
import request from '../../services/request';
import { useStore } from '../../store';
import { useSettingsStore } from '../../store/settings';
import Http from '../arex-request';
const { useToken } = theme;
const HttpBreadcrumb = () => {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application Center</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application List</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};
const RequestPane: FC<any> = ({ pane }) => {
  const { token } = useToken();
  const { collectionTreeData, activeEnvironment, environments, requestType } =
    useStore();
  const { PROXY_URL, EXTENSIONS_ENABLED, PROXY_ENABLED } = useSettingsStore();
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
        breadcrumb={<HttpBreadcrumb />}
        value={data}
        theme={'light'}
        environment={mockEnvironmentData}
        onSave={(p) => {
          console.log(p);
        }}
        onSend={(req) => {
          return AgentAxiosAndTest(
            { request: req },
            'BROWSER_ENABLED',
            'http://localhost:8080'
          );
        }}
      />
    </div>
  );
};

export default RequestPane;

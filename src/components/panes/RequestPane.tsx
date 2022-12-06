import { css, jsx } from '@emotion/react';
import { message, theme } from 'antd';
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
  return (
    <div
      css={css`
        height: calc(100vh - 125px);
      `}
    >
      <Http
        currentRequestId={relationshipRequestId}
        onEdit={(e: any) => {
          if (e.type === 'retrieve') {
            return request({
              method: 'POST',
              url: '/api/retrieverequest',
              data: {
                id: relationshipRequestId,
              },
            });
          } else if (e.type === 'update') {
            return request({
              method: 'POST',
              url: '/api/updaterequest',
              data: {
                id: relationshipRequestId,
                ...e.payload,
              },
            }).then((res) => {
              message.info(JSON.stringify(res));
            });
          }
        }}
        onSend={(e: any) => {
          return AgentAxiosAndTest(e, interceptorSelection, PROXY_URL);
        }}
        collectionTreeData={collectionTreeData}
        environment={mockEnvironmentData}
        darkMode={darkMode.value}
      />
    </div>
  );
};

export default RequestPane;

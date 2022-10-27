import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Breadcrumb, Button, Input, message, Select } from 'antd';
import { useContext, useEffect, useMemo, useRef } from 'react';

// import { AgentAxiosAndTest } from '../../../../../helpers/request';
// import { runTestScript } from '../../helpers/sandbox';
import { treeFind, treeFindPath } from '../../helpers/collection/util';
// import AgentAxios from '../../helpers/request';
import { getValueByPath } from '../../helpers/utils/locale';
import { HttpContext } from '../../index';
import SmartEnvInput from '../smart/EnvInput';

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
  .ant-btn-group,
  .ant-btn {
    margin-left: 16px;
  }
`;

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'CUSTOM',
];

const HttpRequest = ({ currentRequestId, onEdit, collectionTreeData,onSend }) => {
  const { store, dispatch } = useContext(HttpContext);
  const t = (key) => getValueByPath(store.locale, key);

  const handleRequest = () => {
    const urlPretreatment = (url: string) => {
      const currentEnvironment = {
        keyValues: [
          {
            key: 'url',
            value: 'http://127.0.0.1:8080',
          },
        ],
      };
      // 正则匹配{{}}
      const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
      let replaceVar = editorValueMatch[0];
      const env = currentEnvironment?.keyValues || [];
      for (let i = 0; i < env.length; i++) {
        if (env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')) {
          replaceVar = env[i].value;
        }
      }

      return url.replace(editorValueMatch[0], replaceVar);
    };

    console.log(
      store.request.endpoint,
      'store.request.endpoint',
      urlPretreatment(store.request.endpoint),
    );
    // return
    dispatch({
      type: 'response.type',
      payload: 'loading',
    });

    const start = new Date().getTime();

    console.log(store.request.testscript);

    onSend({
      request: store.request,
    }).then((agentAxiosAndTest: any) => {
      dispatch({
        type: 'response.type',
        payload: 'success',
      });

      dispatch({
        type: 'response.body',
        payload: JSON.stringify(agentAxiosAndTest.response.data),
      });

      dispatch({
        type: 'testResult',
        payload: agentAxiosAndTest.testResult,
      });
      dispatch({
        type: 'response.headers',
        payload: agentAxiosAndTest.response.headers,
      });

      dispatch({
        type: 'response.meta',
        payload: {
          responseSize: JSON.stringify(agentAxiosAndTest.response.data).length,
          responseDuration: 0,
        },
      });

      dispatch({
        type: 'response.statusCode',
        payload: agentAxiosAndTest.response.status,
      });
    });
  };
  return (
    <div
      css={css`
        padding: 16px;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        {/*{*/}
        {/*  JSON.stringify(treeFindPath(collectionTreeData,(node)=>node.key === currentRequestId))*/}
        {/*}*/}
        <Breadcrumb style={{ paddingBottom: '14px' }}>
          {treeFindPath(collectionTreeData, (node) => node.key === currentRequestId).map(
            (i, index) => (
              <Breadcrumb.Item key={index}>{i.title}</Breadcrumb.Item>
            ),
          )}
        </Breadcrumb>
        <div>
          <Button
            onClick={() => {
              onEdit({
                type: 'update',
                payload: {
                  ...store.request,
                  id: currentRequestId,
                },
              });
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <HeaderWrapper>
        <Select
          value={store.request.method}
          options={methods.map((i) => ({ value: i, lable: i }))}
          onChange={(value) => {
            dispatch({
              type: 'request.method',
              payload: value,
            });
          }}
        />
        <SmartEnvInput
          value={store.request.endpoint}
          onChange={() => {
            // console.log('http://127.0.0.1:5173/arex-request/');
          }}
        ></SmartEnvInput>
        <Button type='primary' onClick={handleRequest}>
          {t('action.send')}
        </Button>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;

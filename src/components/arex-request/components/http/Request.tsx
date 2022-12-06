import { DownOutlined, UserOutlined } from '@ant-design/icons';

import { css,jsx, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { Breadcrumb, Button, Dropdown, Menu, MenuProps, message, Select } from 'antd';
import { useContext } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { treeFindPath } from '../../helpers/collection/util';
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
`;

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const HttpRequest = ({ currentRequestId, onEdit, onSend }: any) => {
  const { store, dispatch } = useContext(HttpContext);

  const { t } = useTranslation();
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    message.info('Click on menu item.');
  };

  const items: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: '3rd menu item',
      key: '3',
      icon: <UserOutlined />,
    },
  ];


  const handleRequest = ({ type }: any) => {
    const urlPretreatment = (url: string) => {
      const editorValueMatch = url.match(/\{\{(.+?)\}\}/g) || [''];
      let replaceVar = editorValueMatch[0];
      const env = store.environment?.variables || [];
      for (let i = 0; i < env.length; i++) {
        if (
          env[i].key === editorValueMatch[0].replace('{{', '').replace('}}', '')
        ) {
          replaceVar = env[i].value;
        }
      }

      return url.replace(editorValueMatch[0], replaceVar);
    };
    dispatch({
      type: 'response.type',
      payload: 'loading',
    });

    const start = new Date().getTime();

    if (type === 'compare') {
      console.log(1);
    } else {
      onSend({
        request: {
          ...store.request,
          endpoint: urlPretreatment(store.request.endpoint),
        },
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
            responseSize: JSON.stringify(agentAxiosAndTest.response.data)
              .length,
            responseDuration: new Date().getTime() - start,
          },
        });

        dispatch({
          type: 'response.statusCode',
          payload: agentAxiosAndTest.response.status,
        });
      });
    }
  };
  return (
    <div
      css={css`
        padding: 16px;
padding-top: 0;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        `}
      >
        <Breadcrumb style={{ paddingBottom: '14px' }}>
          {treeFindPath(store.collectionTreeData, (node: any) => {
            return node.relationshipRequestId === currentRequestId;
          }).map((i: any, index: number) => (
            <Breadcrumb.Item key={index}>{i.title}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div>
          <Button
            onClick={() => {
              onEdit({
                type: 'update',
                payload: {
                  ...store.request,
                },
              });
            }}
          >
            {t('action.save')}
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
        <div
          css={css`
            margin: 0 0px 0 14px;
          `}
        >
          <Dropdown.Button
              onClick={()=>handleRequest({type:null})}
            type="primary"
            menu={{
              onClick:handleMenuClick,
              items:items
            }}
            icon={<DownOutlined />}
          >
            {t('action.send')}
          </Dropdown.Button>
        </div>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;

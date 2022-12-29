import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Divider, Dropdown, MenuProps, message, Select } from 'antd';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { HttpContext, HttpProps } from '../../index';
import SmartEnvInput from '../smart/EnvInput';
const HeaderWrapper = styled.div`
  display: flex;
`;

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
interface HttpRequestProps {
  onSend: HttpProps['onSend'];
  onSave: HttpProps['onSave'];
  breadcrumb: any;
}
const HttpRequest: FC<HttpRequestProps> = ({ onSend, onSave, breadcrumb }) => {
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
    dispatch((state) => {
      state.response = {
        type: 'loading',
      };
    });
    onSend({
      ...store.request,
      endpoint: urlPretreatment(store.request.endpoint),
    }).then((responseAndTestResult) => {
      dispatch((state) => {
        console.log(store.response, 'sss');
        if (responseAndTestResult.response.type === 'success') {
          state.response = responseAndTestResult.response;
          state.testResult = responseAndTestResult.testResult;
        }
      });
    });
  };
  return (
    <div
      css={css`
        padding: 0 12px;
        //padding-top: 0;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        `}
      >
        {breadcrumb}
        <div>
          <Button
            onClick={() => {
              onSave(store.request);
            }}
          >
            {t('action.save')}
          </Button>
        </div>
      </div>
      <HeaderWrapper>
        <Select
          css={css`
            width: 120px;
          `}
          value={store.request.method}
          options={methods.map((i) => ({ value: i, lable: i }))}
          onChange={(value) => {
            dispatch((state) => {
              state.request.method = value;
            });
          }}
        />
        <SmartEnvInput
          value={store.request.endpoint}
          onChange={(v) => {
            // console.log('http://127.0.0.1:5173/arex-request/');
            dispatch((state) => {
              state.request.endpoint = v;
            });
          }}
        ></SmartEnvInput>
        <div
          css={css`
            margin: 0 0px 0 14px;
          `}
        >
          <Dropdown.Button
            onClick={() => handleRequest({ type: null })}
            type="primary"
            menu={{
              onClick: handleMenuClick,
              items: items,
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

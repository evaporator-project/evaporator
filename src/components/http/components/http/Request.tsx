import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Divider, Dropdown, MenuProps, message, Select } from 'antd';
import { FC, useContext, useMemo } from 'react';
import * as Rhi from 'react-highlight-input';
import { useTranslation } from 'react-i18next';
const { HighlightInput } = Rhi;
console.log(Rhi.HighlightInput, 'HighlightInput');
import { HOPP_ENVIRONMENT_REGEX } from '../../editor/extensions/HoppEnvironment';
import { HttpContext, HttpProps } from '../../index';
import SmartEnvInput from '../smart/EnvInput';
const HeaderWrapper = styled.div`
  display: flex;
  .ant-select-selector {
    border-radius: 0;
    //border-right: none !important;
  }
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
      // let u = url
      for (let j = 0; j < editorValueMatch.length; j++) {
        let replaceVar = editorValueMatch[j];
        const env = store.environment?.variables || [];
        for (let i = 0; i < env.length; i++) {
          if (
            env[i].key ===
            editorValueMatch[j].replace('{{', '').replace('}}', '')
          ) {
            replaceVar = env[i].value;
            url = url.replace(editorValueMatch[j], replaceVar);
          }
        }
      }
      console.log(url);
      return url;
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

  const mockEnvironment = useMemo(() => {
    return store.environment;
  }, [store.environment]);
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
        <HighlightInput
          value={store.request.endpoint}
          onChange={(v) => {
            dispatch((state) => {
              state.request.endpoint = v;
            });
          }}
          highlight={{
            pattern: HOPP_ENVIRONMENT_REGEX,
            class: (match: any) => {
              if (
                mockEnvironment.variables
                  .map((v) => v.key)
                  .includes(match.replace('{{', '').replace('}}', ''))
              ) {
                return 'green';
              } else {
                return 'red';
              }
            },
            tooltip: (match: any) => {
              const key = match.replace('{{', '').replace('}}', '');
              const v = mockEnvironment.variables.find((v) => v.key === key);

              if (!v?.value) {
                return (
                  <div>
                    {'Choose an Environment'}

                    <span
                      style={{
                        backgroundColor: 'rgb(184,187,192)',
                        padding: '0 4px',
                        marginLeft: '4px',
                        borderRadius: '2px',
                      }}
                    >
                      {'Not found'}
                    </span>
                  </div>
                );
              } else {
                return (
                  <div>
                    {mockEnvironment.name}

                    <span
                      style={{
                        backgroundColor: 'rgb(184,187,192)',
                        padding: '0 4px',
                        marginLeft: '4px',
                        borderRadius: '2px',
                      }}
                    >
                      {v?.value}
                    </span>
                  </div>
                );
              }
            },
          }}
          theme={store.theme}
        ></HighlightInput>

        {/*<UbButton>ssss</UbButton>*/}

        <div
          css={css`
            margin: 0 0px 0 10px;
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

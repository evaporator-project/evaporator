import { CheckCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
  Button,
  Divider,
  Popover,
  Radio,
  RadioChangeEvent,
  Space,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import chromeSvg from '../../assets/icons/brands/chrome.svg';
import { useSettingsStore } from '../../store/settings';
const { Text } = Typography;
const AppFooter = () => {
  const [open, setOpen] = useState(false);
  const { PROXY_ENABLED, EXTENSIONS_ENABLED, setInterceptor } =
    useSettingsStore();
  const { t } = useTranslation();

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

  const interceptors = [
    { value: 'BROWSER_ENABLED' as const, label: t('state.none') },
    { value: 'PROXY_ENABLED' as const, label: t('settings.proxy') },
    {
      value: 'EXTENSIONS_ENABLED' as const,
      label: t('settings.extensions'),
    },
  ];

  const onChange = (e: RadioChangeEvent) => {
    setInterceptor(e.target.value);
  };
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <div
      css={css`
        height: 33px;
      `}
      className={'test123'}
    >
      <Divider style={{ margin: '0' }} />
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
        `}
      >
        <div>{/*left*/}</div>

        {/*right*/}
        <div>
          <Popover
            placement={'topRight'}
            // @ts-ignore
            getPopupContainer={() => document.querySelector('.test123')}
            content={
              <div
                css={css`
                  padding: 0 16px;
                `}
              >
                <div
                  css={css`
                    flex-direction: column;
                    display: flex;
                    margin-bottom: 16px;
                  `}
                >
                  <Text>{t('settings.interceptor')}</Text>
                  <Text type="secondary">
                    {t('settings.interceptor_description')}
                  </Text>
                </div>

                <Radio.Group
                  onChange={onChange}
                  value={interceptorSelection}
                  css={css`
                    margin-bottom: 16px;
                  `}
                >
                  <Space direction="vertical">
                    {interceptors.map((i) => (
                      <Radio key={i.value} value={i.value}>
                        {i.label}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
                {interceptorSelection === 'EXTENSIONS_ENABLED' &&
                // @ts-ignore
                !window.__AREX_EXTENSION_INSTALLED__ ? (
                  <div>
                    <Button
                      onClick={() =>
                        window.open(
                          'https://chrome.google.com/webstore/detail/evaporator-extension/gnphghnfglloobkomochoifenbdompjf?hl=zh-CN'
                        )
                      }
                      icon={
                        <img
                          style={{
                            width: '18px',
                            display: 'inline-block',
                            marginRight: '4px',
                            transform: 'translateY(-2px)',
                          }}
                          src={chromeSvg}
                          alt=""
                        />
                      }
                    >
                      Chrome
                    </Button>
                  </div>
                ) : null}
              </div>
            }
            title={false}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <a
              css={css`
                cursor: pointer;
                //width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover {
                  //color: white;
                }
              `}
            >
              {/*<SafetyOutlined />*/}
              {/*<ExclamationCircleOutlined css={css`color: rgb(188,89,77)`} />*/}
              <CheckCircleOutlined
                css={css`
                  color: rgb(58, 130, 70);
                  margin-right: 8px;
                `}
              />
              <Text>
                {
                  interceptors.find((i) => i.value === interceptorSelection)
                    ?.label
                }
              </Text>
            </a>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;

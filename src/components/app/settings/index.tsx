import { SettingOutlined, UndoOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
  Button,
  Input,
  Menu,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { CirclePicker } from 'react-color';
import { useTranslation } from 'react-i18next';

import useDarkMode from '../../../hooks/use-dark-mode';
import request from '../../../services/request';

const { Text } = Typography;
import chromeSvg from '../../../assets/icons/brands/chrome.svg';
import logo from '../../../assets/logo.png';
import languages from '../../../languages.json';
import { MainContext } from '../../../store/content/MainContent';

const Settings = () => {
  const { store, dispatch } = useContext(MainContext);

  const {
    EXTENSIONS_ENABLED,
    PROXY_ENABLED,
    PROXY_URL,
    THEME_COLOR,
    LANGUAGE,
  } = store.settings;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { i18n, t } = useTranslation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    { label: t('settings.theme'), key: '0' }, // 菜单项务必填写 key
    { label: t('shortcut.general.title'), key: '1' },
    { label: t('settings.interceptor'), key: '2' },
    { label: `About Evaporator`, key: '3' },
  ];
  const colors = [
    '#10b981',
    '#14b8a6',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#f59e0b',
    '#f97316',
    '#ef4444',
    '#ec4899',
  ];

  const [selectKey, setSelectKey] = useState('0');

  function handleMenuClick(e: any) {
    setSelectKey(e.key);
  }

  const [mode, setMode] = useState(false);
  const darkMode = useDarkMode();

  useEffect(() => {
    setMode(darkMode.value);
  }, [darkMode.value]);
  return (
    <div>
      <div
        css={css`
          cursor: pointer;
        `}
        onClick={showModal}
      >
        <SettingOutlined />
      </div>

      <Modal
        title={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={850}
      >
        <div
          css={css`
            display: flex;
            min-height: 600px;
          `}
        >
          <div
            css={css`
              background-color: ${darkMode.value ? '#141414' : '#fff'};
              padding: 20px;
            `}
          >
            <p
              css={css`
                font-size: 18px;
              `}
            >
              {t('navigation.settings')}
            </p>
            <Menu
              selectedKeys={[selectKey]}
              onClick={handleMenuClick}
              style={{ width: '255px', height: '500px' }}
              items={items}
            />
          </div>
          <div
            css={css`
              padding: 20px;
              width: 100%;
            `}
          >
            <div
              css={css`
                display: ${selectKey === '0' ? 'block' : 'none'};
              `}
            >
              <p
                css={css`
                  font-size: 16px;
                `}
              >
                {t('settings.theme')}
              </p>

              <p>
                <Text type="secondary">{t('settings.background')}</Text>
              </p>

              <p>
                <Switch
                  defaultChecked={mode}
                  onChange={(val) => {
                    darkMode.toggle(val);
                    dispatch((state) => {
                      state.settings.BG_COLOR = val ? 'dark' : 'light';
                    });
                    request({
                      method: 'POST',
                      url: '/api/usersettings',
                      data: {
                        settings: {
                          THEME_COLOR: THEME_COLOR,
                          BG_COLOR: val ? 'dark' : 'light',
                          LANGUAGE: LANGUAGE,
                        },
                      },
                    }).then((res) => {
                      console.log(res);
                    });
                  }}
                />
              </p>

              <p>
                <Text type="secondary">{t('settings.accent_color')}</Text>
              </p>

              <CirclePicker
                width={'320px'}
                circleSize={20}
                color={THEME_COLOR}
                colors={colors}
                onChangeComplete={(color: any) => {
                  // setAccentColor(color.hex);

                  dispatch((state) => {
                    state.settings.THEME_COLOR = color.hex;
                  });

                  request({
                    method: 'POST',
                    url: '/api/usersettings',
                    data: {
                      settings: {
                        THEME_COLOR: color.hex,
                        BG_COLOR: darkMode.value ? 'dark' : 'light',
                        LANGUAGE: LANGUAGE,
                      },
                    },
                  }).then((res) => {
                    console.log(res);
                  });
                }}
              />
            </div>

            <div
              css={css`
                display: ${selectKey === '1' ? 'block' : 'none'};
              `}
            >
              <p
                css={css`
                  font-size: 16px;
                `}
              >
                {t('shortcut.general.title')}
              </p>

              <p>
                <Text type="secondary">{t('settings.language')}</Text>
              </p>
              <Select
                defaultValue={LANGUAGE}
                onChange={(val: any) => {
                  dispatch((state) => {
                    state.settings.LANGUAGE = val;
                  });
                  i18n.changeLanguage(val);
                  request({
                    method: 'POST',
                    url: '/api/usersettings',
                    data: {
                      settings: {
                        THEME_COLOR: THEME_COLOR,
                        BG_COLOR: darkMode.value ? 'dark' : 'light',
                        LANGUAGE: val,
                      },
                    },
                  }).then((res) => {
                    console.log(res);
                  });
                }}
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                style={{ width: '120px' }}
                options={languages.map((l) => ({
                  label: l.name,
                  value: l.code,
                }))}
              ></Select>
            </div>

            <div
              css={css`
                display: ${selectKey === '2' ? 'block' : 'none'};
              `}
            >
              <Space direction="vertical">
                <p
                  css={css`
                    font-size: 16px;
                  `}
                >
                  {t('settings.interceptor')}
                </p>

                <p>
                  <Text type="secondary">{t('settings.extensions')}</Text>
                </p>

                <Button
                  css={css`
                    margin-bottom: 20px;
                  `}
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

                <div>
                  <Switch
                    checked={EXTENSIONS_ENABLED}
                    onChange={(val) => {
                      if (val) {
                        // setInterceptor('EXTENSIONS_ENABLED');
                      } else {
                        // setInterceptor('PROXY_ENABLED');
                      }
                    }}
                  />
                  <span
                    css={css`
                      margin-left: 8px;
                    `}
                  >
                    {t('settings.extensions_use_toggle')}
                  </span>
                </div>
              </Space>

              <Space
                direction="vertical"
                css={css`
                  padding-top: 60px;
                  width: 100%;
                `}
              >
                <p>
                  <Text type="secondary">{t('settings.proxy')}</Text>
                </p>

                <div>
                  <Switch
                    checked={PROXY_ENABLED}
                    onChange={(val) => {
                      if (val) {
                        // setInterceptor('PROXY_ENABLED');
                      } else {
                        // setInterceptor('EXTENSIONS_ENABLED');
                      }
                    }}
                  />
                  <span
                    css={css`
                      margin-left: 8px;
                    `}
                  >
                    {t('settings.proxy_use_toggle')}
                  </span>
                </div>

                <div
                  css={css`
                    position: relative;
                    margin-top: 20px;
                    display: flex;
                  `}
                >
                  <span
                    css={css`
                      position: absolute;
                      left: 16px;
                      top: -8px;
                      z-index: 10000;
                      font-size: 10px;
                      background-color: ${darkMode.value ? '#141414' : '#fff'};
                      padding: 0 4px;
                    `}
                  >
                    {t('settings.proxy_url')}
                  </span>
                  <Input
                    value={PROXY_URL}
                    onChange={(val) => {
                      // setProxyUrl(val.target.value);
                    }}
                  />
                  <Button
                    css={css`
                      margin-left: 8px;
                    `}
                    onClick={() => {
                      // setProxyUrl(defaultSettings.PROXY_URL);
                    }}
                  >
                    <UndoOutlined />
                  </Button>
                </div>
              </Space>

              {/*"extensions": "扩展",*/}
              {/*"extensions_use_toggle": "使用浏览器扩展发送请求（如果存在）",*/}
            </div>

            <div
              css={css`
                display: ${selectKey === '3' ? 'block' : 'none'};
              `}
            >
              <p
                css={css`
                  font-size: 16px;
                `}
              >
                关于 Apifox
              </p>

              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding-top: 40px;
                `}
              >
                {/*<Title level={4}>Evaporator</Title>*/}
                <img
                  src={logo}
                  css={css`
                    width: 72px;
                  `}
                  alt=""
                />
                <Text
                  css={css`
                    font-size: 18px;
                  `}
                >
                  Evaporator
                </Text>
                <Text
                  css={css`
                    margin-bottom: 20px;
                  `}
                  type="secondary"
                >
                  当前版本 2.2.13-alpha.1
                </Text>
                <div>
                  <Button>查看更新日志</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;

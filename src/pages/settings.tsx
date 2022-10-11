import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Moon, Sun } from '@icon-park/react';
import { Divider, Menu, Modal, Tabs } from 'antd';
import { FC, useState } from 'react';
import { CirclePicker } from 'react-color';

import TestSvg from '../assets/svg/test.svg';
import { useStore } from '../store';

const CuMe = styled(Menu)`
  width: 200px;
`;

const Settings = () => {
  // >=4.20.0 可用，推荐的写法 ✅
  const items = [
    { label: '外观', key: 'item-1' }, // 菜单项务必填写 key
    { label: '通用', key: 'item-2' },
  ];
  const { settingModalOpen, setSettingModalOpen, themeClassify, changeTheme } = useStore();
  // const {} = useStore()
  const [color, setColor] = useState('');
  function handleOk() {
    setSettingModalOpen(false);
  }
  function handleCancel() {
    setSettingModalOpen(false);
  }
  return (
    <div>
      <Modal
        title={false}
        open={settingModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={950}
      >
        <div
          css={css`
            display: flex;
          `}
        >
          <div
            css={css`
              margin-right: 10px;
              //background-color: seashell;
              .ant-menu-vertical {
                border-right: none;
              }
            `}
          >
            <CuMe
              items={[
                {
                  label: '外观',
                  key: 'mail',
                },
                {
                  label: '通用',
                  key: 'app',
                },
              ]}
            />
          </div>
          <Divider style={{ height: '300px' }} type={'vertical'} />
          <div>
            <div css={css``}>
              <p>外观</p>
              <div>
                <div>
                  <p>背景</p>
                  <div
                    css={css`
                      cursor: pointer;
                    `}
                    onClick={() => {
                      if (themeClassify === 'light') {
                        changeTheme('dark-purple');
                      } else {
                        changeTheme('light-purple');
                      }
                    }}
                  >
                    {JSON.stringify(themeClassify)}
                    {themeClassify === 'light' ? <Moon></Moon> : <Sun />}
                  </div>
                </div>
                <div>
                  <p
                    css={css`
                      font-size: 16px;
                    `}
                  >
                    主色
                  </p>
                  <p>{JSON.stringify(color)}</p>
                  <CirclePicker
                    width={'320px'}
                    circleSize={20}
                    color={color}
                    colors={['red', 'blue']}
                    onChangeComplete={(value) => {
                      setColor(value.hex);
                    }}
                  />
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

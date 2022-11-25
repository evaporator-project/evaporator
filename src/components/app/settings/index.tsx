import { SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Menu, Modal, Switch } from 'antd';
import { useEffect, useState } from 'react';
// @ts-ignore
import { CirclePicker } from 'react-color';

import useDarkMode from '../../../hooks/use-dark-mode';
import {useStore} from "../../../store";
const Settings = () => {

  const {setColorPrimary} = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    { label: '菜单项一', key: 'item-1' }, // 菜单项务必填写 key
    { label: '菜单项二', key: 'item-2' },
  ];
  const colors = ['#10b981', '#14b8a6','#3b82f6','#6366f1','#8b5cf6','#f59e0b','#f97316','#ef4444','#ec4899'];

  const [value, setValue] = useState('#0ff011');
  const [mode, setMode] = useState(false);
  const darkMode = useDarkMode();

  useEffect(() => {
    // console.log(darkMode.value);
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
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          css={css`
            display: flex;
          `}
        >
          <div>
            <Menu items={items} />
          </div>
          <div>
            <p>
              暗黑模式
              {JSON.stringify(darkMode.value)}
              <Switch
                defaultChecked={mode}
                onChange={(val) => {
                  darkMode.toggle(val);
                }}
              />
            </p>

            <CirclePicker
              width={'320px'}
              circleSize={20}
              color={value}
              colors={colors}
              onChangeComplete={(color: any) => {
                // console.log(color,'color')

                setColorPrimary(color.hex)

                setValue(color.hex);
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;

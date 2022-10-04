import { css } from '@emotion/react';
import { Menu, Modal, Tabs } from 'antd';
import { FC, useState } from 'react';

import { useStore } from '../store';


const Settings = () => {
  // >=4.20.0 可用，推荐的写法 ✅
  const items = [
    { label: '外观', key: 'item-1' }, // 菜单项务必填写 key
    { label: '通用', key: 'item-2' },
  ];
  const { settingModalOpen, setSettingModalOpen } = useStore();

  // const [open, setOpen] = useState(false);
  function handleOk() {
    setSettingModalOpen(false);
  }
  function handleCancel() {
    setSettingModalOpen(false);
  }
  return (
    <div>
      <Modal title='SETTINGS' open={settingModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tabs
          tabPosition={'left'}
          items={items.map((_, i) => {
            return {
              label: _.label,
              key: _.key,
              children: `Content of Ta`,
            };
          })}
        />
      </Modal>
    </div>
  );
};
export default Settings;

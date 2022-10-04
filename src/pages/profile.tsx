import { css } from '@emotion/react';
import { Drawer, Menu, Modal, Tabs } from 'antd';
import { FC, useState } from 'react';

import { useStore } from '../store';


const Profile = () => {
  // >=4.20.0 可用，推荐的写法 ✅
  const items = [
    { label: '外观', key: 'item-1' }, // 菜单项务必填写 key
    { label: '通用', key: 'item-2' },
  ];
  const { profileModalOpen, setProfileModalOpen } = useStore();

  // const [open, setOpen] = useState(false);
  function handleOk() {
    setProfileModalOpen(false);
  }
  function handleCancel() {
    setProfileModalOpen(false);
  }
  return (
    <div>
      <Drawer title='Profile' open={profileModalOpen} width={'80%'}>
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
      </Drawer>
    </div>
  );
};
export default Profile;

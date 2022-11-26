import {
  DownOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Input, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import request from '../../../services/request';
import { useStore } from '../../../store';
import CollectionTitle from './CollectionTitle';

const CollectionMenu = ({ onSelect }: any) => {
  const params: any = useParams();
  const { setCollectionTreeData } = useStore();
  const {
    data: treeData = [],
    loading,
    run: fetchTreeData,
  }: any = useRequest(
    () =>
      request({
        method: 'POST',
        url: '/api/getcollectiontree',
        data: { workspaceId: params.workspaceId },
      }),
    {
      onSuccess: (res) => {
        setCollectionTreeData(res);
      },
    }
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(value);
  };

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const handleSelect = (keys: any, info: any) => {
    if (keys.length && onSelect) {
      onSelect(keys[0] as string, {
        title: info.node.title,
        key: info.node.key,
        nodeType: info.node.nodeType,
      });
    }
  };
  return (
    <div>
      <div className={'collection-header'}>
        <Input
          className={'collection-header-search'}
          size="small"
          placeholder=""
          prefix={<SearchOutlined />}
          onChange={onChange}
        />
        {/*<Tooltip placement='bottomLeft' title={'View more actions'} mouseEnterDelay={0.5}>*/}
        {/*  <Button className={'collection-header-view'} type='text' size='small'>*/}
        {/*    <DashOutlined />*/}
        {/*  </Button>*/}
        {/*</Tooltip>*/}
      </div>
      <Tree
        autoExpandParent
        blockNode={true}
        selectedKeys={[]}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={handleSelect}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        titleRender={(val) => <CollectionTitle val={val} />}
      />
    </div>
  );
};

export default CollectionMenu;

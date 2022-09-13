import { DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useMount, useRequest } from 'ahooks';
import { Button, Input, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { DirectoryTreeProps } from 'antd/lib/tree';
import axios from 'axios';
// import { DataNode } from 'antd/lib/tree';
// import { CollectionService } from '../../services/CollectionService';
import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { NodeType } from '../../constant';
import { FileService } from '../../services/FileService';
import { useStore } from '../../store';
import TooltipButton from '../TooltipButton';
import CollectionTitle from './CollectionTitle';
const CollectionMenuWrapper = styled.div`
  height: 100%;
  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }

  .collection-header {
    display: flex;
    justify-content: space-between;
    //margin-top: 10px;
    //margin-bottom: 10px;
    .collection-header-create {
      margin-right: 5px;
      span.action {
        font-weight: bold;
      }
    }
    .collection-header-search {
    }
    .collection-header-view {
      margin: 0 5px;
    }
  }

  .collection-title-render {
    display: flex;
    .right {
    }
    .left {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      .content {
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
    }
  }
  .ant-tree-node-content-wrapper {
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;

// import CollectionTitleRender from './CollectionTitleRender';
// import { arrToTree } from '../../helpers/collection/util';
export type nodeType = {
  title: string;
  key: string;
  nodeType: NodeType;
} & DataNode;
const CollectionMenu = ({ value, onSelect,cRef }) => {
  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(cRef, () => {
    // 需要将暴露的接口返回出去
    return {
      func: function () {
        fetchTreeData()
      },
    };
  });
  const { setCollectionTreeData } = useStore();
  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const handleSelect: DirectoryTreeProps<nodeType>['onSelect'] = (keys, info) => {
    if (keys.length && onSelect) {
      onSelect(keys[0] as string, {
        title: info.node.title,
        key: info.node.key,
        nodeType: info.node.nodeType,
      });
    }
  };

  const {
    data: treeData = [],
    loading,
    run: fetchTreeData,
  } = useRequest(() => FileService.getcollectiontree({}), {
    onSuccess: (res) => {
      console.log(res, 'res');
      setCollectionTreeData(res);
      // setColl
    },
  });

  const { run: createCollection } = useRequest(
    () =>
      FileService.createACollection({
        name: 'Top Folder',
        nodeType: 3,
        pid: '',
      }).then((res) => {
        console.log(res);
      }),
    {
      manual: true,
      onSuccess() {
        fetchTreeData();
      },
    },
  );

  return (
    <CollectionMenuWrapper>
      <div className={'collection-header'}>
        <TooltipButton
          icon={<PlusOutlined />}
          type='text'
          size='small'
          className={'collection-header-create'}
          onClick={createCollection}
          placement='bottomLeft'
          title={'Create New'}
        />
        <Input
          className={'collection-header-search'}
          size='small'
          placeholder=''
          prefix={<MenuOutlined />}
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
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={handleSelect}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        titleRender={(val) => (
          <CollectionTitle updateDirectoryTreeData={fetchTreeData} val={val} treeData={treeData} />
        )}
      />
    </CollectionMenuWrapper>
  );
};

export default CollectionMenu;

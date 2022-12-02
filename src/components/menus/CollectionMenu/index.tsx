import {
  DownOutlined,
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
/** @jsx jsx */
import { css,jsx } from '@emotion/react';
import { useRequest } from 'ahooks';
import { Input, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import request from '../../../services/request';
import { useStore } from '../../../store';
import CollectionTitle from './CollectionTitle';
import { handleDrop } from './helper';
import SearchHeighLight from './searchHeighLight';

const CollectionMenu = ({ onSelect }: any) => {
  const params: any = useParams();
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
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

  // const dataList: { key: React.Key; title: string }[] = [];

  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };

  const dataList = useMemo(() => {
    const dataListsss: any = [];
    const generateList = (data: DataNode[]) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        // console.log(node)
        const { key, title: name } = node;
        dataListsss.push({ key, title: name });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(treeData);
    console.log(dataListsss, 'dataListsss');
    return dataListsss;
  }, [treeData]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const regExp = new RegExp(value, 'i');
    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item.title.match(regExp)) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter(
        (item: any, i: any, self: any) => item && self.indexOf(item) === i
      );
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const onExpand: any = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const handleSelect = (keys: any, info: any) => {
    if (keys.length && onSelect) {
      onSelect(keys[0] as string, {
        title: info.node.title,
        key: info.node.key,
        nodeType: info.node.nodeType,
      });
    }
  };

  const ffftreeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const title = <CollectionTitle val={item} searchValue={searchValue} updateDirectoryTreeData={fetchTreeData} treeData={treeData} />;
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    return loop(treeData);
  }, [treeData, searchValue]);

  useEffect(() => {
    // console.log(ffftreeData);
  }, [ffftreeData]);

  // 树拖拽
  const onDrop: TreeProps['onDrop'] = (info: any) => {
    const { fromNodePath, toParentPath, toIndex } = handleDrop(treeData, info);
    request({
      method: 'POST',
      url: '/api/movefile',
      data: {
        fromNodePath,
        id: params.workspaceId,
        toParentPath,
        toIndex,
      },
    }).then((res) => {
      console.log(res, 'res');
      fetchTreeData();
    });
  };
  return (
    <div
      css={css`
        height: 500px;
        padding-right: 12px;
      `}
    >
      <div
        className={'collection-header'}
        css={css`
          display: flex;
          padding-top: 12px;
          padding-bottom: 12px;
        `}
      >
        <span
          onClick={() => {
            request({
              method: 'POST',
              url: '/api/createfile',
              data: {
                nodeType: 3,
                name: 'New Folder',
                pid: '',
                workspaceId: params.workspaceId,
              },
            }).then((res) => {
              fetchTreeData();
            });
          }}
          css={css`
            cursor: pointer;
            width: 24px;
          `}
        >
          +
        </span>
        <Input
          className={'collection-header-search'}
          size="small"
          placeholder=""
          prefix={<SearchOutlined />}
          onChange={onChange}
        />
      </div>
      <Tree
          blockNode={true}
        selectedKeys={[]}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        onSelect={handleSelect}
        switcherIcon={<DownOutlined />}
        treeData={ffftreeData}
        draggable={{ icon: false }}
        onDrop={onDrop}
      />
    </div>
  );
};

export default CollectionMenu;

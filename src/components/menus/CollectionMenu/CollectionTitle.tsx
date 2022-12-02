import { MoreOutlined } from '@ant-design/icons';
/** @jsx jsx */
import { css,jsx } from '@emotion/react';
import { Dropdown, Input, Popconfirm, Space } from 'antd';
import { useMemo, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';

import { methodMap } from '../../../constant';
import { treeFindPath } from '../../../helpers/collection/util';
import request from '../../../services/request';
import SearchHeighLight from './searchHeighLight';
const CollectionTitle = ({
  val,
  searchValue,
  treeData,
  updateDirectoryTreeData,
}: any) => {
  const params = useParams();
  const method: any = useMemo(() => {
    return Object.keys(methodMap).includes(val.relationshipRequestMethod)
      ? val.relationshipRequestMethod
      : 'UNKNOWN';
  }, [val]);
  const [open, setOpen] = useState(false);
  const menu = (val: any) => {
    const paths = treeFindPath(treeData, (node: any) => {
      return node.key === val.key;
    });
    return {
      items: [
        {
          key: '3',
          label: (
            //必须要用a标签，不然无法disable
            <span className={'dropdown-click-target'}>Add Folder</span>
          ),
          // 只有类型为3才能新增文件夹
          disabled: val.nodeType !== 3,
        },
        {
          key: '1',
          label: <span className={'dropdown-click-target'}>Add Request</span>,
          disabled: val.nodeType !== 3,
        },
        {
          key: '2',
          label: <span className={'dropdown-click-target'}>Add Case</span>,
          disabled: val.nodeType !== 1,
        },
        {
          key: '4',
          label: <span className={'dropdown-click-target'}>Rename</span>,
        },
        {
          key: '6',
          label: <span className={'dropdown-click-target'}>Duplicate</span>,
        },
        {
          key: '5',
          label: (
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                request({
                  method: 'POST',
                  url: '/api/deleteFileService',
                  data: {
                    id: val.id,
                  },
                }).then((res) => {
                  updateDirectoryTreeData();
                });
              }}
            >
              <a style={{ color: 'red' }}>Delete</a>
            </Popconfirm>
          ),
        },
      ],
      onClick(e: any) {
        switch (e.key) {
          case '3':
            console.log(params);
            request({
              method: 'POST',
              url: '/api/createfile',
              data: {
                nodeType: 3,
                name: 'New Folder',
                pid: paths.map((i: any) => i.key).at(-1),
                workspaceId: params.workspaceId,
              },
            }).then((res) => {
              updateDirectoryTreeData();
            });
            break;
          case '1':
            request({
              method: 'POST',
              url: '/api/createfile',
              data: {
                nodeType: 1,
                name: 'New Request',
                pid: paths.map((i: any) => i.key).at(-1),
                workspaceId: params.workspaceId,
              },
            }).then((res) => {
              updateDirectoryTreeData();
            });
            break;
          case '2':
            request({
              method: 'POST',
              url: '/api/createfile',
              data: {
                nodeType: 2,
                name: 'New Request',
                pid: paths.map((i: any) => i.key).at(-1),
                workspaceId: params.workspaceId,
              },
            }).then((res) => {
              updateDirectoryTreeData();
            });
            break;
          case '4':
            setRenameKey(val.id);
            setRenameValue(val.title);
            break;
          // case '6':
          //   CollectionService.duplicate({
          //     id: _useParams.workspaceId,
          //     path: paths.map((i: any) => i.key),
          //     userName,
          //   }).then((res) => {
          //     console.log(res);
          //     updateDirectoryTreeData();
          //   });
        }
        e.domEvent.stopPropagation();
        setOpen(false);
      },
    };
  };
  const [renameKey, setRenameKey] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const rename = () => {
    // const paths = treeFindPath(treeData, (node:any) => node.key === val.key);
    request({
      method: 'POST',
      url: '/api/updatefile',
      data: {
        id: renameKey,
        name: renameValue,
      },
    }).then((res) => {
      updateDirectoryTreeData();
      setRenameValue('');
      setRenameKey('');
    });
  };
  return (
    <div
      className={'collection-title-render'}
      css={css`
        display: flex;
        justify-content: space-between;
        width: 100%;
      `}
    >
      <div
        className={'left'}
        css={css`
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
        `}
      >
        {val.nodeType === 1 && (
          <span
            // @ts-ignore
            css={css(`color:${methodMap[method].color};margin-right:4px`)}
          >
            {method}
          </span>
        )}
        {val.nodeType === 2 && <span>case</span>}
        <div
          css={css`
            display: inline-block;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; //溢出不换行
          `}
        >
          {renameKey === val.id ? (
            <Input
              width={'100%'}
              style={{ padding: '0 4px', width: '100%' }}
              value={renameValue}
              onPressEnter={rename}
              onBlur={rename}
              onChange={(val) => setRenameValue(val.target.value)}
            />
          ) : (
            <SearchHeighLight text={val.name} keyword={searchValue} />
          )}
        </div>
      </div>

      <div>
        <Dropdown
          menu={menu(val)}
          trigger={['click']}
          open={open}
          onOpenChange={setOpen}
        >
          <span onClick={(event) => event.stopPropagation()}>
            <Space>
              <MoreOutlined size={100} style={{ fontSize: '16px' }} />
            </Space>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default CollectionTitle;

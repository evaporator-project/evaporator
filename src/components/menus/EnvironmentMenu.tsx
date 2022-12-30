import {
  EllipsisOutlined,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { css, useTheme } from '@emotion/react';
import MonacoEditor from '@monaco-editor/react';
import {
  Button,
  Dropdown,
  Input,
  Menu,
  MenuProps,
  message,
  Modal,
  Space,
  Tooltip,
} from 'antd';
import mongoose from 'mongoose';
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import useDarkMode from '../../hooks/use-dark-mode';
import request from '../../services/request';
// import { HttpContext } from '../http';
import { MainContext } from '../../store/content/MainContent';
// import Search from "antd/es/input/Search";
// const {Search} = Input
const EnvironmentMenu: FC<{ onSelect: any; value: any }> = ({
  onSelect,
  value,
}) => {
  const params = useParams();
  const theme = useTheme();

  // const { environments } = useStore();
  const { store, dispatch } = useContext(MainContext);
  // const { view } = useCodeMirror({
  //   container: jsonResponse.current,
  //   value: JSON.stringify(environments, null, 2),
  //   height: '300px',
  //   extensions: [EditorView.lineWrapping, json()],
  //   lineWrapping: true,
  //   theme: darkMode.value ? 'dark' : 'light',
  // });

  // const params = useParams()

  useEffect(() => {
    const s = store.globalState.environments.find(
      (environment) => environment.id === params.paneId
    );
    if (params.paneId && s?.name) {
      onSelect(params.paneId, {
        title: s.name,
        key: params.paneId,
      });
    }

    // const id = new mongoose.Types.ObjectId();

    // console.log({ id: String(id) });
  }, [store.globalState.environments]);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button danger type={'link'}>
          删除
        </Button>
      ),
    },
  ];
  return (
    <div
      css={css`
        margin-right: 12px;
      `}
    >
      <div
        css={css`
          display: flex;
          padding-top: 12px;
          padding-bottom: 12px;
        `}
      >
        <div
          css={css`
            width: 24px;
          `}
        >
          <PlusOutlined
            onClick={() => {
              const id = String(new mongoose.Types.ObjectId());
              dispatch((state) => {
                state.globalState.environments.push({
                  name: 'New Environment',
                  variables: [],
                  id: id,
                });
              });

              request({
                method: 'POST',
                url: '/api/updateworkspace',
                data: {
                  id: params.workspaceId,
                  environments: [
                    ...store.globalState.environments,
                    {
                      name: 'new',
                      variables: [],
                      id: id,
                    },
                  ],
                },
              }).then((res) => {
                console.log(res);
                message.success(JSON.stringify(res));
              });
            }}
          />
        </div>
        <Input
          css={css`
            width: 100%;
          `}
          size={'small'}
          prefix={<FilterOutlined />}
        />
      </div>
      {store.globalState.environments.map((environment, index) => {
        return (
          <div
            css={css`
              padding-left: 12px;
              padding-top: 12px;
              padding-bottom: 12px;
              cursor: pointer;
              height: 24px;
              background-color: ${theme.colorBgBase};
              padding-right: 10px;
              //cursor: pointer;
              margin: 10px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .test {
                visibility: hidden;
              }
              &:hover {
                background-color: ${theme.colorBgTextActive};
                .test {
                  visibility: visible;
                }
              }
              .test:hover {
                //display: block;
                color: ${theme.colorBgTextActive};
              }
            `}
            key={index}
            onClick={() => {
              onSelect(environment.id, {
                title: environment.name,
                key: environment.id,
              });
            }}
          >
            {environment.name}

            <Dropdown
              menu={{
                items,
                onClick: function onClick({ item, key, keyPath, domEvent }) {
                  console.log({ item, key, keyPath, domEvent });
                  if (key === '1') {
                    dispatch((state) => {
                      state.globalState.environments =
                        store.globalState.environments.filter(
                          (e) => e.id !== environment.id
                        );
                    });

                    request({
                      method: 'POST',
                      url: '/api/updateworkspace',
                      data: {
                        id: params.workspaceId,
                        environments: store.globalState.environments.filter(
                          (e) => e.id !== environment.id
                        ),
                      },
                    }).then((res) => {
                      console.log(res);
                      message.success(JSON.stringify(res));
                    });
                  }
                },
              }}
              trigger={['click']}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <EllipsisOutlined className={'test'} />
                </Space>
              </a>
            </Dropdown>
          </div>
        );
      })}
    </div>
  );
};
export default EnvironmentMenu;

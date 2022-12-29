import MonacoEditor from '@monaco-editor/react';
import { Button, Dropdown, Input, Menu, message, Modal, Tooltip } from 'antd';
import React, { FC, useContext, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import useDarkMode from '../../hooks/use-dark-mode';
import request from '../../services/request';
// import { HttpContext } from '../http';
import { MainContext } from '../../store/content/MainContent';

const EnvironmentMenu: FC<{ onSelect: any; value: any }> = ({
  onSelect,
  value,
}) => {
  const params = useParams();

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
  return (
    <div
      onClick={() => {
        onSelect('key', {});
      }}
    >
      <MonacoEditor
        height={'200px'}
        value={JSON.stringify(store.globalState.environments, null, 2)}
        language={'json'}
        options={{
          minimap: {
            enabled: false,
          },
        }}
        onChange={(val) => {
          if (val) {
            dispatch((state) => {
              try {
                state.globalState.environments = JSON.parse(val);
              } catch (e) {
                console.log(e);
              }
            });
          }
        }}
        theme={store.settings.BG_COLOR === 'light' ? 'light' : 'vs-dark'}
      />

      <Button
        onClick={() => {
          request({
            method: 'POST',
            url: '/api/updateworkspace',
            data: {
              id: params.workspaceId,
              environments: store.globalState.environments,
            },
          }).then((res) => {
            message.info(JSON.stringify(res));
          });
        }}
      >
        更新
      </Button>
    </div>
  );
};
export default EnvironmentMenu;

import {
  CheckCircleFilled,
  CheckCircleOutlined,
  DashOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';

import { css,jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import {Button, Dropdown, Input, Menu, message, Modal, Tooltip} from 'antd';
import React, { FC, useContext, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import useDarkMode from '../../hooks/use-dark-mode';
import request from '../../services/request';
import { useStore } from '../../store';

// import { HttpContext } from '../arex-request';
// import { useCodeMirror } from '../arex-request/helpers/editor/codemirror';

const EnvironmentMenu: FC<{ onSelect: any; value: any }> = ({
  onSelect,
  value,
}) => {
  const jsonResponse = useRef(null);
  const darkMode = useDarkMode();
  const params = useParams();

  const { environments } = useStore();

  const { view } = useCodeMirror({
    container: jsonResponse.current,
    value: JSON.stringify(environments, null, 2),
    height: '300px',
    extensions: [EditorView.lineWrapping, json()],
    lineWrapping: true,
    theme: darkMode.value ? 'dark' : 'light',
  });
  return (
    <div
      onClick={() => {
        onSelect('key', {});
      }}
    >
      EnvironmentMenu{value}
      <div ref={jsonResponse}></div>
      <Button
        onClick={() => {
          let jsonData = [];
          try {
            // @ts-ignore
            jsonData = JSON.parse(view?.state.doc.toString());
          } catch (e) {
            console.log(e);
          }
          request({
            method: 'POST',
            url: '/api/updateworkspace',
            data: {
              id: params.workspaceId,
              environments: jsonData,
            },
          }).then((res) => {
            message.info(JSON.stringify(res))
          });
        }}
      >
        更新
      </Button>
    </div>
  );
};
export default EnvironmentMenu;

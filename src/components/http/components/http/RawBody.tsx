import { css } from '@emotion/react';
import MonacoEditor from '@monaco-editor/react';
import { message } from 'antd';
import { useContext, useImperativeHandle } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { HttpContext } from '../../index';

const HttpRawBody = ({ cRef }: any) => {
  const { store, dispatch } = useContext(HttpContext);
  const { t } = useTranslation();
  useImperativeHandle(cRef, () => {
    return {
      prettifyRequestBody: function () {
        prettifyRequestBody();
      },
    };
  });
  const prettifyRequestBody = () => {
    try {
      const jsonObj = JSON.parse(store.request.body.body as string);
      dispatch((state) => {
        state.request.body.body = JSON.stringify(jsonObj, null, 2);
      });
    } catch (e) {
      message.error(t('error.json_prettify_invalid_body'));
    }
  };

  return (
    <div
      css={css`
        flex: 1;
        overflow-y: auto;
      `}
    >
      <MonacoEditor
          loading={<div></div>}
        height={'100%'}
        value={store.request.body.body as string}
        onChange={(value) => {
          if (value) {
            dispatch((state) => {
              state.request.body.body = value;
            });
          }
        }}
        language={'json'}
        options={{
          minimap: {
            enabled: false,
          },
          fontFamily: 'IBMPlexMono, "Courier New", monospace',
          scrollBeyondLastLine: false,
          wordWrap: 'wordWrapColumn',
        }}
        theme={store.theme === 'light' ? 'light' : 'vs-dark'}
      />
    </div>
  );
};

export default HttpRawBody;

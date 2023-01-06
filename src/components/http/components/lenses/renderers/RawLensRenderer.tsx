// import { EditorView } from '@codemirror/view';
import { css } from '@emotion/react';
import MonacoEditor from '@monaco-editor/react';
import React, { FC, useContext, useRef } from 'react';

// import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';
import { HttpContext } from '../../../index';
const RawLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  const { store } = useContext(HttpContext);
  // useCodeMirror({
  //   container: jsonResponse.current,
  //   value: response.type === 'success' ? JSON.stringify(response.body) : '',
  //   height: '100%',
  //   extensions: [EditorView.lineWrapping],
  //   lineWrapping: true,
  //   theme: store.theme,
  // });
  return (
    <div
      css={css`
        height: 100%;
      `}
    >
      <MonacoEditor
        value={response.type === 'success' ? JSON.stringify(response.body) : ''}
        language={'txt'}
        options={{
            fontFamily: 'IBMPlexMono, "Courier New", monospace',
          minimap: {
            enabled: false,
          },
        }}
        theme={store.theme === 'light' ? 'light' : 'vs-dark'}
      />
    </div>
  );
};

export default RawLensRenderer;

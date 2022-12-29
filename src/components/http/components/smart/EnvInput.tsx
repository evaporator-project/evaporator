import { css, useTheme } from '@emotion/react';
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React, { FC, useContext, useEffect, useRef } from 'react';

import {
  getMarkFromToArr,
  HOPP_ENVIRONMENT_REGEX,
} from '../../editor/extensions/HoppEnvironment';
import { HttpContext } from '../../index';

interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange }) => {
  const theme = useTheme();
  const editorRef = useRef(null);
  const { store } = useContext(HttpContext);

  function handleEditorDidMount(editor: any, monaco: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
    decorations();
  }
  useEffect(() => {
    if (editorRef.current) {
      decorations();
    }
  }, [store.environment]);
  function decorations() {
    const editor: any = editorRef.current;
    const { found, matchEnv, from, to } = getMarkFromToArr(
      value,
      HOPP_ENVIRONMENT_REGEX,
      store.environment
    )[0] || { from: 0, to: 0 };
    console.log({ matchEnv, found });
    const ids = [];
    const decorations = editor?.getModel().getAllDecorations();
    console.log(decorations, 'decorations');

    let myContentClass = 'myContentClass';

    if (found) {
      myContentClass = 'myContentClass-green';
    } else {
      myContentClass = 'myContentClass';
    }

    for (const decoration of decorations) {
      if (
        decoration &&
        decoration.options &&
        (decoration.options.className === 'myContentClass' ||
          decoration.options.className === 'myContentClass-green')
      ) {
        ids.push(decoration.id);
      }
    }

    console.log(ids, 'ids');
    if (ids && ids.length) {
      editor?.deltaDecorations(ids, []);
    }

    // console.log({from,to})
    // editor?.deltaDecorations([],[])
    editor?.deltaDecorations(
      [], // oldDecorations 每次清空上次标记的
      [
        {
          range: new monaco.Range(1, from + 1, 1, to + 1), // rowStart, columnStart, rowEnd, columnEnd
          options: {
            isWholeLine: false,
            className: myContentClass, // 代码行样式类名
            glyphMarginClassName: myContentClass, // 行数前面小块标记样式类名
          },
        },
      ] // 如果需要清空所有标记，将 newDecorations 设为空数组即可
    );
  }
  return (
    <div
      css={css`
        border: 1px solid ${theme.colorBorder};
        flex: 1;
        display: flex;
        align-items: center;
      `}
    >
      {/*<p>{JSON.stringify(store.environment)}</p>*/}
      <MonacoEditor
        height={18}
        value={value}
        onChange={(value) => {
          onChange(value);
          decorations();
        }}
        onMount={handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
          lineNumbers: 'off',
          fontSize: 12,
        }}
        theme={store.theme === 'light' ? 'light' : 'vs-dark'}
      />
    </div>
  );
};

export default SmartEnvInput;

import { css, useTheme } from '@emotion/react';
import MonacoEditor from '@monaco-editor/react';
import { Tooltip } from 'antd';
import * as monaco from 'monaco-editor';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';

import {
  getMarkFromToArr,
  HOPP_ENVIRONMENT_REGEX,
} from '../../editor/extensions/HoppEnvironment';
import { HttpContext } from '../../index';
import SmartTooltip from './Tooltip';
const TooltipContent: FC<{ match: any; mockEnvironment: any }> = ({
  match,
  mockEnvironment,
}) => {
  const key = match.replace('{{', '').replace('}}', '');
  const v = mockEnvironment.variables.find((v: any) => v.key === key);
  return (
    <div className={'rhi-tooltip'}>
      <div className="content">
        {!v?.value ? (
          <div>
            {'Choose an Environment'}

            <span
              style={{
                backgroundColor: 'rgb(184,187,192)',
                padding: '0 4px',
                marginLeft: '4px',
                borderRadius: '2px',
              }}
            >
              {'Not found'}
            </span>
          </div>
        ) : (
          <div>
            {mockEnvironment.name}
            <span
              style={{
                backgroundColor: 'rgb(184,187,192)',
                padding: '0 4px',
                marginLeft: '4px',
                borderRadius: '2px',
              }}
            >
              {v?.value}
            </span>
          </div>
        )}
      </div>
      <div className="shim">
        <div className="small-triangle"></div>
      </div>
    </div>
  );
};
// 获取元素的绝对位置坐标（像对于浏览器视区左上角）
function getElementViewPosition(element: any) {
  //计算x坐标
  let actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft + current.clientLeft;
    current = current.offsetParent;
  }
  if (document.compatMode == 'BackCompat') {
    var elementScrollLeft = document.body.scrollLeft;
  } else {
    var elementScrollLeft = document.documentElement.scrollLeft;
  }
  const left = actualLeft - elementScrollLeft;
  //计算y坐标
  let actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop + current.clientTop;
    current = current.offsetParent;
  }
  if (document.compatMode == 'BackCompat') {
    var elementScrollTop = document.body.scrollTop;
  } else {
    var elementScrollTop = document.documentElement.scrollTop;
  }
  const right = actualTop - elementScrollTop;
  //返回结果
  return { x: left, y: right };
}
interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange }) => {
  const theme = useTheme();
  const editorRef = useRef(null);
  const { store } = useContext(HttpContext);

  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [textContent, setTextContent] = useState('');

  function handleEditorDidMount(editor: any, monaco: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
    editor.lineHighlightBackground = 'red';
    editor.selectionBackground = 'red';
    editor.lineHighlightBorder = 'red';
    // editorRef.current
    decorations();
  }
  useEffect(() => {
    if (editorRef.current) {
      decorations();
    }
    console.log(store.environment, 'store.environment');
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
      console.log('decoration.options', decoration.options.inlineClassName);
      if (
        decoration &&
        decoration.options &&
        (decoration.options.inlineClassName === 'myContentClass' ||
          decoration.options.inlineClassName === 'myContentClass-green')
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
            // className: myContentClass, // 代码行样式类名
            // glyphMarginClassName: myContentClass, // 行数前面小块标记样式类名
            inlineClassName: myContentClass,
          },
        },
      ] // 如果需要清空所有标记，将 newDecorations 设为空数组即可
    );
  }

  function fn1(e) {
    const { x, y } = getElementViewPosition(e.target);
    const l = x;
    const t = y;
    setLeft(l);
    setTop(t);
    setOpen(true);
    // @ts-ignore
    setTextContent(e.target.textContent);
    // console.log(e.target.textContent)
  }
  function fn2() {
    setOpen(false);
  }
  useEffect(() => {
    setTimeout(() => {
      // console.log(document.querySelector('.myContentClass-green'))

    }, 500);

    document.querySelector('.dakuangzi').addEventListener('mouseenter', (e) => {
      try {
        const a = document.querySelector('.myContentClass-green');
        // @ts-ignore
        // a.removeEventListener('mouseover',fn1)
        // a.removeEventListener('mouseout',fn2)
        a.addEventListener('mouseover', fn1);

        // @ts-ignore
        a.addEventListener('mouseout', fn2);
      } catch (e) {}

      try {
        const b = document.querySelector('.myContentClass');
        // @ts-ignore
        b.addEventListener('mouseover', function (e) {
          const { x, y } = getElementViewPosition(e.target);
          const l = x;
          const t = y;
          setLeft(l);
          setTop(t);
          setOpen(true);
          // @ts-ignore
          setTextContent(e.target.textContent);
          // console.log(e.target.textContent)
        });
        // @ts-ignore
        b.addEventListener('mouseout', function (e) {
          setOpen(false);
        });
      } catch (e) {}
    });
  }, [store.environment]);
  return (
    <div
      className={'dakuangzi'}
      css={css`
        border: 1px solid ${theme.colorBorder};
        flex: 1;
        display: flex;
        align-items: center;
      `}
    >
      {/*<p>{JSON.stringify(store.environment)}</p>*/}
      <MonacoEditor
        height={21}
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
          fontSize: 14,
          fontFamily: 'IBMPlexMono, "Courier New", monospace',
          scrollbar: {
            useShadows: false,
            vertical: 'hidden',
            horizontal: 'hidden',
          },
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          renderLineHighlight: 'none',
        }}
        theme={store.theme === 'light' ? 'light' : 'vs-dark'}
      />
      <SmartTooltip
        open={open}
        content={
          <TooltipContent
            match={textContent}
            mockEnvironment={store.environment}
          />
        }
        left={left}
        top={top}
        contentHeight={0}
      />
    </div>
  );
};

export default SmartEnvInput;

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useCodeMirror } from './useCodeMirror';


export interface ReactCodeMirrorRef {
  editor?: HTMLDivElement | null;
  state?: any;
  view?: any;
}

const ReactCodeMirror = forwardRef<ReactCodeMirrorRef, any>((props, ref) => {
  const {
    className,
    value = '',
    selection,
    extensions = [],
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    autoFocus,
    theme = 'light',
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    basicSetup,
    placeholder,
    indentWithTab,
    editable,
    readOnly,
    root,
    initialState,
    ...other
  } = props;
  const editor = useRef<HTMLDivElement>(null);
  const { state, view, container, setContainer } = useCodeMirror({
    container: editor.current,
    root,
    value,
    autoFocus,
    theme,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    basicSetup,
    placeholder,
    indentWithTab,
    editable,
    readOnly,
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions,
    initialState,
  });

  useImperativeHandle(ref, () => ({ editor: editor.current, state: state, view: view }), [
    editor,
    container,
    state,
    view,
  ]);

  // check type of value
  if (typeof value !== 'string') {
    throw new Error(`value must be typeof string but got ${typeof value}`);
  }

  const defaultClassNames = typeof theme === 'string' ? `cm-theme-${theme}` : 'cm-theme';
  return <div ref={editor} className={`${defaultClassNames}${className ? ` ${className}` : ''}`} {...other}></div>;
});

ReactCodeMirror.displayName = 'CodeMirror';

export default ReactCodeMirror;

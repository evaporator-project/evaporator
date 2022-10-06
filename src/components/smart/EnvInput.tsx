// import './EnvInput.less';

import { json } from '@codemirror/lang-json';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import CodeMirror from 'codemirror';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { useStore } from '../../store';
import { HttpContext } from '../panes/Request';
import { useEnvCodeMirror } from '../../helpers/editor/extensions/EnvCodeMirror';
import { css } from '@emotion/react';
// import { ThemeClassify } from '../../style/theme';
interface SmartEnvInputProps {
  value: string;
  onChange: (e: any) => void;
}
const SmartEnvInput: FC<SmartEnvInputProps> = ({ value, onChange }) => {
  console.log(value,'va')
  const [editor, setEditor] = useState(null);
  const smartEnvInputRef = useRef(null);

  const { store,dispatch } = useContext(HttpContext);

  const { state, view } = useEnvCodeMirror({
    container: smartEnvInputRef.current,
    value: value,
    height: '30px',
    extensions: [json()],
    onChange: (val) => {
      // console.log(val,'val')
      // console.log(view,'sss')
      // dis
      dispatch({
        type: 'setRequestEndpoint',
        payload: val,
      });
    },
  });

  useEffect(() => {
    console.log(state, 'state');
  }, [state]);

  return (
    <div className={'smart-env'}  css={css`width: 100%;display: inline-block`}>
      {/*<p>{store.request.endpoint}</p>*/}
      {/*<p>{value}</p>*/}
      <div ref={smartEnvInputRef} id='smart-env-input'></div>
    </div>
  );
};

export default SmartEnvInput;

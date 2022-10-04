import { json } from '@codemirror/lang-json';
import { FC, useRef } from 'react';

import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';

import { sublime } from '@uiw/codemirror-theme-sublime';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';

const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  // JSON.stringify(jsonObj, null, 2)
  const jsonObj = JSON.parse(response.body||'{}');
  useCodeMirror({
    container: jsonResponse.current,
    value: JSON.stringify(jsonObj, null, 2),
    height: '300px',
    extensions: [json()],
    theme: xcodeDark
  });
  return (
    <div>
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default JSONLensRenderer;

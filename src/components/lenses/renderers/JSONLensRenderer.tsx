import { FC, useRef } from 'react';
import { json } from '@codemirror/lang-json';
import { useCodeMirror } from '../../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../../helpers/types/HoppRESTResponse';

const JSONLensRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  const jsonResponse = useRef(null);
  useCodeMirror({
    container: jsonResponse.current,
    value: response.body,
    height: '300px',
    extensions: [json()],
  });
  return (
    <div>

      <div ref={jsonResponse}></div>
    </div>
  );
};

export default JSONLensRenderer;

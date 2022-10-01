import { json } from '@codemirror/lang-json';
import { useRef } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';

const LensesResponseBodyRenderer = ({ response }) => {
  const jsonResponse = useRef(null);

  useCodeMirror({
    container: jsonResponse.current,
    value: response,
    height: '300px',
    extensions: [json()],
  });
  return (
    <div>
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default LensesResponseBodyRenderer;

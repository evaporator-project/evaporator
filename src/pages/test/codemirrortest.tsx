// import TestEnvCodemirror from './TestEnvCodemirror';

import { useTestEnvCodemirror } from "./TestEnvCodemirror"
import { useRef, useState } from 'react';
import { json } from '@codemirror/lang-json';

const TestCodemirror = () => {
  // use
  const [value,setValue] = useState('ff')
  const testCon = useRef(null)
  useTestEnvCodemirror({
    container:testCon.current,
    value:value,
    height: '300px',
    extensions: [json()],
    onChange: (val) => {
      setValue(val)
    },
  })
  return <div>
    <div ref={testCon}></div>
  </div>
}

export default TestCodemirror

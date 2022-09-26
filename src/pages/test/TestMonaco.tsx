import React, {useEffect, useRef} from "react";
import { javascript } from '@codemirror/lang-javascript';
import {useCodeMirror} from "../../helpers/editor/codemirror";


const TestMonaco: React.FC = () => {
  const r = useRef(null)

  useCodeMirror({
    container:r.current,
    value:'console.log(123)',
    height:'300px',
    extensions:[javascript()]
  })

  return <div className="editor" ref={r}></div>;
};

export default TestMonaco

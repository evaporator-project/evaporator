import {useRef} from "react";
import {useCodeMirror} from "../../helpers/editor/codemirror";
import {json} from "@codemirror/lang-json";

const LensesResponseBodyRenderer = ()=>{
  const jsonResponse = useRef(null)

  useCodeMirror({
    container: jsonResponse.current,
    value: `{
    "name":"zhangwenrou"
    }`,
    height: '300px',
    extensions: [json()],
  });
  return <div>
    <div ref={jsonResponse}></div>
  </div>
}

export default LensesResponseBodyRenderer

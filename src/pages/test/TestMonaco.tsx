import React, {useEffect, useRef} from "react";

import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {useMount} from "ahooks";
import {useCodemirror} from "../../helpers/editor/codemirror";
// import {useCodemirror} from "../../helpers/editor/utils";

const TestMonaco: React.FC = () => {
  const r = useRef(null)
  useCodemirror(r,'var a = 1',{})

  return <div className="editor" ref={r}></div>;
};

export default TestMonaco

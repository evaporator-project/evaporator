import {useEffect, useRef} from "react";
import * as monaco from 'monaco-editor';

const TestMonaco: React.FC = () => {
  const divEl = useRef<HTMLDivElement>(null);
  let editor: monaco.editor.IStandaloneCodeEditor;
  useEffect(() => {
    if (divEl.current) {
      editor = monaco.editor.create(divEl.current, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'typescript',
        fontSize:20,
        fontFamily:'monaco',
        minimap: {
          enabled:false
        }
      });
    }
    return () => {
      editor.dispose();
    };
  }, []);
  return <div className="Editor" ref={divEl}></div>;
};

export default TestMonaco

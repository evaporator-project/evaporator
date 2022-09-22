import { LinterDefinition } from "./linting/linter"
import {Completer} from "./completion";
import {Ref, useEffect, useRef, useState} from "react";
import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript";

type ExtendedEditorConfig = {
  mode: string
  placeholder: string
  readOnly: boolean
  lineWrapping: boolean
}

type CodeMirrorOptions = {
  extendedEditorConfig: Partial<ExtendedEditorConfig>
  linter: LinterDefinition | null
  completer: Completer | null

  // NOTE: This property is not reactive
  environmentHighlights: boolean
}

// 还是参考react-codemirror https://uiwjs.github.io/react-codemirror，项目结构学习hop就可以
export function useCodemirror(
  el: any,
  value: string,
  options: CodeMirrorOptions
): { cursor: { line: number; ch: number } } {


  const [view,setView] = useState<EditorView>()


  useEffect(()=>{
    // init
    console.log(el.current,view)
    if (el.current&&!view) {
      initView(el.current)
      console.log(12)
    }
    // 组件卸载销毁
    return ()=>{
      console.log('卸146')
      view?.destroy()
    }
  },[])

  const initView = (el: any) => {
    setView(new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        javascript(),
      ],
      parent: el
    }))
  }

  // cursor光标
  const cursor = useState({
    line: 0,
    ch: 0,
  })

  // useEffect(()=>{
  //   if (el.current){
  //     // console.log('有就卸载')
  //     // setView(undefined)
  //     // initView(el.current)
  //   } else {
  //
  //   }
  // },[el])

  return {
    cursor:{
      ch:12,
      line:1
    },
  }
}

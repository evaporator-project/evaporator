import { EditorState, StateEffect, StateEffectType, StateField } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { Decoration, DecorationSet, EditorView, keymap, ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useState } from 'react';

import { getStatistics } from './utils';
// import {defaultKeymap} from "@codemirror/commands"
export interface UseCodeMirror {
  container?: HTMLDivElement | null;
}
export function useEnvCodeMirror(props: UseCodeMirror) {
  const {
    value,
    initialState,
    root,
    onCreateEditor,
    theme = 'light',
    extensions,
    height,
    onStatistics,
    onChange,
  } = props;
  const [container, setContainer] = useState<HTMLDivElement>();
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();

  const defaultLightThemeOption = EditorView.theme(
    {
      '&': {
        backgroundColor: '#fff',
      },
      '.cm-scroller': {
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '14px',
      },
    },
    {
      dark: false,
    },
  );
  const defaultThemeOption = EditorView.theme({
    '&': {
      height,
    },
  });
  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (vu.docChanged && typeof onChange === 'function') {
      const doc = vu.state.doc;
      const value = doc.toString();
      onChange(value, vu);
    }
    onStatistics && onStatistics(getStatistics(vu));
  });

  let getExtensions = [updateListener, defaultThemeOption];

  getExtensions.unshift(basicSetup); //存疑

  switch (theme) {
    case 'light':
      getExtensions.push(defaultLightThemeOption);
      break;
    case 'dark':
      getExtensions.push(oneDark);
      break;
    default:
      // console.log(theme,'theme')
      getExtensions.push(theme);
      break;
  }

  getExtensions = getExtensions.concat(extensions);
  // console.log(getExtensions,'getExtensions')
  useEffect(() => {
    if (container && !state) {
      const config = {
        doc: value,
        extensions: getExtensions,
      };
      const stateCurrent = initialState
        ? EditorState.fromJSON(initialState.json, config, initialState.fields)
        : EditorState.create(config);

      // EditorState.ran
      setState(stateCurrent);
      if (!view) {
        // console.log(state,'state')
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root,
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }
    return () => {
      if (view) {
        setState(undefined);
        setView(undefined);
      }
    };
  }, [container, state]);

  useEffect(() => setContainer(props.container!), [props.container]);

  // view改变，更新
  useEffect(
    () => () => {
      if (view) {
        view.destroy();
        setView(undefined);
      }
    },
    [view],
  );

  // 外部配置改变，更新
  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, extensions, height]);

  const errorMarkTheme = EditorView.baseTheme({
    '.cm-error-mark': {
      backgroundColor: 'red',
    },
  });

  const errorMark = Decoration.mark({
    class: 'cm-error-mark',
  });
  const addErrorMarks: StateEffectType<any> = StateEffect.define<{ from: number; to: number }>();
  const markField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },
    update(marks, tr) {
      marks = marks.map(tr.changes);
      for (const effect of tr.effects) {
        if (effect.is(addErrorMarks)) {
          marks = marks.update({
            add: [errorMark.range(effect.value.from, effect.value.to)],
          });
        }
      }
      return marks;
    },
    provide: (field) => EditorView.decorations.from(field),
  });

  // 外部value改变，更新
  useEffect(() => {
    const currentValue = view ? view.state.doc.toString() : '';



    let from = 0
    let to = 0

    // 正则匹配{{}}
    const editorValueMatch = currentValue.match(/\{\{(.+?)\}\}/g);
    // 匹配到时才mark
    // TODO暂时只做了单个{{}}的匹配
    if (editorValueMatch && editorValueMatch[0]) {
      const matchValueLeftRight = currentValue.split(editorValueMatch[0]);
      // 寻找标记的起始位置
      const start = matchValueLeftRight[0].length;
      const end = matchValueLeftRight[0].length + editorValueMatch[0].length;
      console.log({start,end})
      from = start
      to = end
    }




    // 必须用起始位置标记
    const code = `t\nest`;
    const lines = code.split('\n');


    const effects = [addErrorMarks.of({ from, to })];

    if (view && value !== currentValue) {
      effects.push(StateEffect.appendConfig.of([markField, errorMarkTheme]));
      console.log(effects,'effects')

      if (to - from>0){
        view.dispatch({
          changes: { from: 0, to: currentValue.length, insert: value || '' },
          effects: effects,
        });
      } else {
        view.dispatch({
          changes: { from: 0, to: currentValue.length, insert: value || '' }
        });
      }


    }
  }, [value, view]);

  return { state, setState, view, setView, container, setContainer };
}

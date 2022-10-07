import { EditorState, StateEffect, StateEffectType, StateField } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { Decoration, EditorView, keymap, ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useState } from 'react';

import { getStatistics } from './utils';
// import {defaultKeymap} from "@codemirror/commands"
export interface UseCodeMirror {
  container?: HTMLDivElement | null;
}
export function useTestEnvCodemirror(props: UseCodeMirror) {
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

  const errorMarkTheme = EditorView.baseTheme({
    '.cm-error-mark': {
      background: 'green',
    },
  });
  const errorMark = Decoration.mark({
    class: 'cm-error-mark',
  });

  // Effects can be attached to transactions to communicate with the extension
  const addMarks = StateEffect.define(),
    filterMarks = StateEffect.define();

  const addErrorMarks: StateEffectType<any> = StateEffect.define<{ from: number; to: number }>();

  // This value must be added to the set of extensions to enable this
  const markField = StateField.define({
    // Start with an empty set of decorations
    create() {
      return Decoration.none;
    },
    // This is called whenever the editor updates—it computes the new set
    update(marks, tr) {
      marks = marks.map(tr.changes);
      for (const effect of tr.effects) {
        if (effect.is(addErrorMarks)) {
          marks = marks.update({
            add: [errorMark.range(effect.value.from, effect.value.to)],
          });
        }
        if (effect.is(filterMarks)) {
          marks = marks.update({
            filter: effect.value,
          });
        }
      }
      return marks;
    },
    // Indicate that this field provides a set of decorations
    provide: (f) => EditorView.decorations.from(f),
  });

  const strikeMark = Decoration.mark({
    attributes: { style: 'color: green' },
  });

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
      console.log(theme, 'theme');
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
      setState(stateCurrent);
      if (!view) {
        console.log(stateCurrent);
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

  // 外部value改变，更新
  useEffect(() => {
    const currentValue = view ? view.state.doc.toString() : '';
    if (view && value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
      });
    } else {
      const effects = [addErrorMarks.of({ from: 0, to: 1 })];
      if (!state?.field(markField, false)) {
        effects.push(StateEffect.appendConfig.of([markField, errorMarkTheme]));
      }

      if (currentValue.length>10) {
        view?.dispatch({
          effects: filterMarks.of((from, to) => to <= 100 || from >= 0),
        });
      } else {
        view?.dispatch({
          effects: effects,
        });
      }
    }
  }, [value, view]);

  return { state, setState, view, setView, container, setContainer };
}

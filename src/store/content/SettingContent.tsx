import produce, { Draft } from 'immer';
import { createContext, Dispatch, FC, useReducer } from 'react';

const defaultMainState = {
  settings: {
    PROXY_ENABLED: false,
  },
};
export interface MainState {
  settings: {
    PROXY_ENABLED: boolean;
  };
}

export const SettingContext = createContext<
  { store: MainState } & { dispatch: Dispatch<(state: MainState) => void> }
>({
  store: defaultMainState,
  dispatch: () => undefined,
});
function reducer(draft: Draft<MainState>, action: (state: MainState) => void) {
  return action(draft);
}
const MainProvider: FC<any> = ({ children }) => {
  const [store, dispatch] = useReducer(produce(reducer), defaultMainState);

  return (
    <SettingContext.Provider value={{ store, dispatch }}>
      {children}
    </SettingContext.Provider>
  );
};

export default MainProvider;

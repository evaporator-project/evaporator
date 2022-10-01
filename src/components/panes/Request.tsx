import { useRequest } from 'ahooks';
import { createContext, useMemo, useReducer } from 'react';

import { treeFind } from '../../helpers/collection/util';
import request from '../../services/request';
import { useStore } from '../../store';
import AppPaneLayout from '../app/PaneLayout';
import HttpRequest from '../http/Request';
import HttpRequestOptions from '../http/RequestOptions';
import HttpResponse from '../http/Response';

export const ColorContext = createContext({});

const defaultState = {
  endpoint: '',
  method: '',
  rawParamsBody: '',
  response: '',
};

function reducer(state = defaultState, action) {
  ///reducer负责操作数据
  if (action.type === 'setEndpoint') {
    return { ...state, endpoint: action.payload };
  }
  if (action.type === 'setMethod') {
    return { ...state, method: action.payload };
  }
  if (action.type === 'setRawParamsBody') {
    return { ...state, rawParamsBody: action.payload };
  }
  if (action.type === 'setResponse') {
    console.log(action,'re')
    return { ...state, response: action.payload };
  }
  return state;
}
const RequestPage = ({ id, updateCol }) => {
  const [store, dispatch] = useReducer(reducer, defaultState); //创建reducer
  const { collectionTreeData } = useStore();
  const realId = useMemo(() => {
    return treeFind(collectionTreeData, (node) => {
      return node.key === id;
    })?.relationshipRequestId;
  }, [id]);
  const {
    data,
    loading,
    run: fetchTreeData,
  } = useRequest(
    () => {
      const a = treeFind(collectionTreeData, (node) => node.key === id);
      return request({
        method: 'POST',
        url: `/api/retrieverequest`,
        data: { id: a?.relationshipRequestId },
      });
    },
    {
      onSuccess: (res) => {},
    },
  );
  return (
    <ColorContext.Provider value={{ store, dispatch }}>
      <AppPaneLayout
        primary={
          <div>
            {data ? (
              <HttpRequest id={realId} pid={id} data={data} updateCol={updateCol}></HttpRequest>
            ) : null}
            <HttpRequestOptions data={data}></HttpRequestOptions>
          </div>
        }
        secondary={<HttpResponse></HttpResponse>}
      ></AppPaneLayout>
    </ColorContext.Provider>
  );
};

export default RequestPage;

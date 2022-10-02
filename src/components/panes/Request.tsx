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
  request: {
    params: [],
  },
  response: {
    type: 'success',
    headers: [],
    statusCode: 200,
    meta: {
      responseSize: 0,
      responseDuration: 1,
    },
    error: {
      name: '',
      message: '',
      stack: '',
    },
  },
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
    console.log(action, 're');
    return { ...state, response: action.payload };
  }
  if (action.type === 'setRequestParams') {
    return {
      ...state,
      request: {
        ...state.request,
        params: action.payload,
      },
    };
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
      onSuccess: (res) => {
        console.log(res, 'res');
        dispatch({
          type: 'setRequestParams',
          payload: [{ key: '1', value: '2', active: true }],
        });
      },
    },
  );
  // 需要有值才展示，不然mounted的时候没数据
  return (
    <ColorContext.Provider value={{ store, dispatch }}>
      <AppPaneLayout
        primary={
          <div>
            {data ? (
              <div>
                <HttpRequest id={realId} pid={id} data={data} updateCol={updateCol}></HttpRequest>
                <HttpRequestOptions data={data}></HttpRequestOptions>
              </div>
            ) : null}
          </div>
        }
        secondary={<HttpResponse></HttpResponse>}
      ></AppPaneLayout>
    </ColorContext.Provider>
  );
};

export default RequestPage;

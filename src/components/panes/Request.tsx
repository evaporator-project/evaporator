import { useRequest } from 'ahooks';
import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { createContext, useMemo, useReducer } from 'react';

import { HoppRESTRequest } from '../../data/rest';
import { treeFind } from '../../helpers/collection/util';
import request from '../../services/request';
import { useStore } from '../../store';
import AppPaneLayout from '../app/PaneLayout';
import HttpRequest from '../http/Request';
import HttpRequestOptions from '../http/RequestOptions';
import HttpResponse from '../http/Response';

export const HttpContext = createContext({});

const defaultState = {
  endpoint: '',
  method: '',
  rawParamsBody: '',
  request: {
    preRequestScript: '',
    v: '1',
    headers: [],
    name: 'updatePet',
    body: {
      contentType: 'application/json',
      body: '',
    },
    testScript: '',
    method: 'PUT',
    auth: {
      authURL: 'http://petstore.swagger.io/api/oauth/dialog',
      oidcDiscoveryURL: '',
      accessTokenURL: '',
      clientID: '',
      scope: 'write:pets read:pets',
      token: '',
      authType: 'oauth-2',
      authActive: true,
    },
    endpoint: '<<baseUrl>>/pet',
    params: [],
  },
  response: {
    type: 'success',
    headers: [],
    statuscode: 200,
    body: '',
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

function find(object, path) {
  const props = path.split('.');
  for (let i = 0; i < props.length; i++) {
    const p = props[i];
    if (object && object.hasOwnProperty(p)) {
      object = object[p];
    } else {
      return undefined;
    }
  }
  return object;
}

function reducer(state = defaultState, action) {
  function underline(str) {
    return str.replace(/\B([A-Z])/g, '_$1').toLowerCase();
  }
  const clonestate = JSON.parse(JSON.stringify(state));

  const arr = underline(action.type).split('_');

  _.set(clonestate, arr.slice(1, arr.length).join('.'), action.payload);
  return clonestate;
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
      return request<HoppRESTRequest>({
        method: 'POST',
        url: `/api/retrieverequest`,
        data: { id: a?.relationshipRequestId },
      });
    },
    {
      onSuccess: ({ endpoint, params, method, headers, body }) => {
        dispatch({
          type: 'setRequestMethod',
          payload: method,
        });
        dispatch({
          type: 'setRequestParams',
          payload: params,
        });
        dispatch({
          type: 'setRequestEndpoint',
          payload: endpoint,
        });
        dispatch({
          type: 'setRequestHeaders',
          payload: headers,
        });
        dispatch({
          type: 'setRequestBody',
          payload: body,
        });
      },
    },
  );
  // 需要有值才展示，不然mounted的时候没数据
  return (
    <HttpContext.Provider value={{ store, dispatch }}>
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
    </HttpContext.Provider>
  );
};

export default RequestPage;

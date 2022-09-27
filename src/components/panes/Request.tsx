import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { createContext, useEffect, useMemo, useReducer } from 'react';

import { treeFind } from '../../helpers/collection/util';
import { FileService } from '../../services/FileService';
import request from '../../services/request';
import { useStore } from '../../store';
import AppPaneLayout from '../app/PaneLayout';
import HttpRequest from '../http/Request';
import HttpRequestOptions from '../http/RequestOptions';
import HttpResponse from '../http/Response';

// ** 心得 **
// Request组件，作为一个复杂组件，首先进来组件通过id拉取数据，记为data,通过props将数据传递下去，
// 下层组件都维护自己的状态，例如form表单，codemirror的value，onchange的时候修改自己的状态，
// 情况一，点击保存，函数在最顶层Request组件，负责收集下层的所有数据，准备好发送保存数据的请求，紧接着每个组件监听data，data重新更新了，刷新底下的所有监听data的地方，（避免死循环）
// 情况二，点击发送，收集数据，发送
export const Context = createContext(null);

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// 创建store
const store = {
  user: { name: 'jgmiu', age: 24 },
  params: { key: 'key', date: '20190802' },
};

// reducer 创建
const user = (state, action) => {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.value };
    case 'age':
      return { ...state, age: action.value };
    default:
      return state;
  }
};
const params = (state, action) => {
  switch (action.type) {
    case 'key':
      return { ...state, key: action.value };
    case 'date':
      return { ...state, date: action.value };
    default:
      return state;
  }
};

// 自定义合并reducer函数
const combineReducers = (reducers) => {
  return function (state, action) {
    return Object.keys(reducers)
      .map((k) => ({ [k]: reducers[k](state[k], action) }))
      .reduce((prev, cur) => Object.assign({}, prev, cur));
  };
};
const reducers = combineReducers({ user, params });

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// 这个组件将来需要和mainbox一样，承载所有的事件，数据交互
const RequestPage = ({ id, updateCol }) => {
  // 在最顶层得到 store 与 dispatch
  const [state, dispatch] = useReducer(reducers, store);

  // console.log(id,'id')
  const { collectionTreeData } = useStore();
  const realId = useMemo(() => {
    return treeFind(collectionTreeData, (node) => {
      console.log(node.key, id);
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
        // setCollectionTreeData(res)
        // setColl
      },
    },
  );
  return (
    <Context.Provider value={{ state, dispatch }}>
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
    </Context.Provider>
  );
};

export default RequestPage;

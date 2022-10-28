import 'allotment/dist/style.css';
import 'antd/dist/antd.css';

import { css } from '@emotion/react';
import { useMount } from 'ahooks';
import { Allotment } from 'allotment';
import _ from 'lodash-es';
import { createContext, FC, useEffect, useImperativeHandle, useReducer, useState } from 'react';

import HttpRequest from './components/http/Request';
import HttpRequestOptions from './components/http/RequestOptions';
import HttpResponse from './components/http/Response';
import TestResult from './components/http/TestResult';
import cn from './locales/cn.json';
import en from './locales/en.json';
import { themeMap } from './theme';
const localeMap = {
  cn: {
    type: 'cn',
    locale: cn,
  },
  en: {
    type: 'en',
    locale: en,
  },
};

export const HttpContext = createContext({});
export const GlobalContext = createContext({});

const globalDefaultState = {
  theme: themeMap.light,
  locale: localeMap.en,
  collectionTreeData: [],
};

const defaultState = {
  request: {
    preRequestScript: '',
    v: '',
    headers: [],
    name: '',
    body: {
      contentType: 'application/json',
      body: '',
    },
    testScript: '',
    method: '',
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
    endpoint: '',
    params: [],
  },
  response: {
    type: 'success',
    headers: [],
    statusCode: 200,
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
  testResult: {},
};

function reducer(state = defaultState, action) {
  const clonestate = JSON.parse(JSON.stringify(state));
  _.set(clonestate, action.type, action.payload);
  return clonestate;
}

interface HttpProps {
  currentRequestId: string;
  onEdit: ({ type, payload }) => any;
  onSend: () => any;
  // ---
  envData: [];
  currentEnvId: string;
  requestExtraTabItems: any;
  requestExtraData: any;
  cRef: any;
}

const HttpProvider = ({ children, theme = 'light', locale = 'en', collectionTreeData = [] }) => {
  const [store, dispatch] = useReducer(reducer, globalDefaultState);
  useEffect(() => {
    dispatch({
      type: 'locale',
      payload: localeMap[locale],
    });
  }, [locale]);

  useEffect(() => {
    dispatch({
      type: 'theme',
      payload: themeMap[theme],
    });
  }, [theme]);

  useEffect(() => {
    dispatch({
      type: 'collectionTreeData',
      payload: collectionTreeData,
    });
  }, [collectionTreeData]);
  // console.log({theme})
  return <GlobalContext.Provider value={{ store, dispatch }}>{children}</GlobalContext.Provider>;
};

// TODO
/*
1. ArexRequestComponent =》 HttpRequest
2. 核心props 全局props/locale、theme、collectionTreeData？，内部props/currentRequestId、onEdit、onSend,
3. 字典例如 onSend以后触发的函数名称，返回值里面需要包含{testResult,response}
4. 导出的方法
* */
const Http: FC<HttpProps> = ({ currentRequestId, onEdit, onSend, cRef }) => {
  const [store, dispatch] = useReducer(reducer, {
    ...defaultState,
    request: {
      ...defaultState.request,
    },
  });

  useMount(() => {
    onEdit({
      type: 'retrieve',
      payload: {
        requestId: currentRequestId,
      },
    }).then((res) => {
      dispatch({
        type: 'request',
        payload: res,
      });
    });
  });
  // 需要将暴露的接口返回出去
  useImperativeHandle(cRef, () => {
    return {
      func: func,
      setValue(value) {
        dispatch({
          type: 'request.mock',
          payload: value,
        });
      },
    };
  });

  function func() {
    return store.request;
  }
  return (
    <HttpContext.Provider value={{ store, dispatch }}>
      {store.request.endpoint !== '' ? (
        <Allotment
          css={css`
            height: calc(100vh - 118px);
          `}
          vertical={true}
        >
          <Allotment.Pane preferredSize={400}>
            <div
              css={css`
                height: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <HttpRequest
                currentRequestId={currentRequestId}
                onEdit={onEdit}
                onSend={onSend}
              ></HttpRequest>
              <HttpRequestOptions></HttpRequestOptions>
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <HttpResponse />
          </Allotment.Pane>
        </Allotment>
      ) : null}
    </HttpContext.Provider>
  );
};

export default Http;

export { HttpProvider };

export { TestResult };

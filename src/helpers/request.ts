import axios from 'axios';

import { runTestScript } from './sandbox';

function realRequest(reqParams: any, requestType: any, url: string) {
  if (requestType === 'EXTENSIONS_ENABLED') {
    return AgentAxios(reqParams);
  } else if (requestType === 'BROWSER_ENABLED') {
    return axios(reqParams);
  } else if (requestType === 'PROXY_ENABLED') {
    return axios.post(url, reqParams);
  } else {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }
}

function AgentAxios<T>(params: any) {
  return new Promise<T>((resolve, reject) => {
    const tid = String(Math.random());
    window.postMessage(
      {
        type: '__AREX_EXTENSION_REQUEST__',
        tid: tid,
        payload: params,
      },
      '*'
    );
    window.addEventListener('message', receiveMessage);
    function receiveMessage(ev: any) {
      if (ev.data.type === '__AREX_EXTENSION_RES__' && ev.data.tid == tid) {
        window.removeEventListener('message', receiveMessage, false);
        // 这边的err类型是真正的error，而不是401、404这种
        if (ev.data.res.type === 'error') {
          const err = new Error();
          err.message = ev.data.res.message;
          err.name = ev.data.res.name;
          err.stack = ev.data.res.stack;
          reject(err);
        } else {
          resolve(ev.data.res);
        }
      }
    }
  });
}

export default AgentAxios;

export const AgentAxiosAndTest = ({ request }: any, requestType: string, url:string) =>
  realRequest(
    {
      method: request.method,
      url: request.endpoint,
      headers: request.headers.reduce((p: any, c: any) => {
        return {
          ...p,
          [c.key]: c.value,
        };
      }, {}),
      data: ['GET'].includes(request.method)
        ? undefined
        : JSON.parse(request.body.body || '{}'),
      params: ['POST'].includes(request.method)
        ? undefined
        : request.params.reduce((p: any, c: any) => {
            return {
              ...p,
              [c.key]: c.value,
            };
          }, {}),
    },
    requestType,
    url
  ).then((res: any) => {
    console.log(res);
    return runTestScript(request.testScript, {
      body: res.data,
      headers: res.headers,
      status: res.status,
    }).then((test) => {
      return {
        response: res,
        testResult: test.tests,
      };
    });
  });

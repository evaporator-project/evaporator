import axios from 'axios';

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

export const AgentAxiosAndTest = ({ request }: any) =>
  AgentAxios({
    method: request.method,
    url: request.endpoint,
    headers: request.headers.reduce((p:any, c:any) => {
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
      : request.params.reduce((p:any, c:any) => {
          return {
            ...p,
            [c.key]: c.value,
          };
        }, {}),
  }).then((res: any) => {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
          url:'/api/sandbox',
        data: {
          testScript: request.testScript,
          response: res,
        },
      }).then((r) => {
        resolve({
          response: res,
          testResult: r.data.testResult,
        });
      });
    });
  });

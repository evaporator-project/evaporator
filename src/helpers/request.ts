import { SandboxTestResult, TestDescriptor } from 'evaporator-js-sandbox';

import { HoppRESTResponse } from '../components/http/helpers/types/HoppRESTResponse';
import {
  HoppTestData,
  HoppTestResult,
} from '../components/http/helpers/types/HoppTestResult';
import { runTestScript } from './sandbox';

function translateToSandboxTestResults(
  testDesc: SandboxTestResult
): HoppTestResult {
  const translateChildTests = (child: TestDescriptor): HoppTestData => {
    return {
      description: child.descriptor,
      expectResults: child.expectResults,
      tests: child.children.map(translateChildTests),
    };
  };

  return {
    description: '',
    expectResults: testDesc.tests.expectResults,
    tests: testDesc.tests.children.map(translateChildTests),
    scriptError: false,
    envDiff: {
      global: {
        additions: [],
        deletions: [],
        updations: [],
      },
      selected: {
        additions: [],
        deletions: [],
        updations: [],
      },
    },
  };
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

export const AgentAxiosAndTest = ({
  request,
}: any): Promise<{
  response: HoppRESTResponse;
  testResult: HoppTestResult;
}> => {
  const startTime = new Date().getTime();
  return AgentAxios({
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
  }).then((res: any) => {
    return runTestScript(request.testScript, {
      body: res.data,
      headers: res.headers,
      status: res.status,
    }).then((testDescriptor) => {
      const s = translateToSandboxTestResults(testDescriptor);

      return {
        response: {
          type: 'success',
          headers: res.headers,
          body: res.data,
          statusCode: res.status,
          meta: {
            responseDuration: new Date().getTime() - startTime,
            responseSize: JSON.stringify(res.data).length,
          },
        },
        testResult: s,
      };
    });
  });
};

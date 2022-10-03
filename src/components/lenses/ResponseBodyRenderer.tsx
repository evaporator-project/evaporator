import { json } from '@codemirror/lang-json';
import { Tabs } from 'antd';
import { FC, useRef } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { HoppRESTResponse } from '../../helpers/types/HoppRESTResponse';
import HttpParameters from '../http/Parameters';
import LensesHeadersRenderer from './HeadersRenderer';
import JSONLensRenderer from './renderers/JSONLensRenderer';
import RawLensRenderer from './renderers/RawLensRenderer';

const LensesResponseBodyRenderer: FC<{ response: HoppRESTResponse }> = ({ response }) => {
  // const jsonResponse = useRef(null);

  // useCodeMirror({
  //   container: jsonResponse.current,
  //   value: response.body,
  //   height: '300px',
  //   extensions: [json()],
  // });
  const items = [
    {
      label: 'JSON',
      key: '0',
      children: <JSONLensRenderer response={response} />,
    },
    {
      label: 'Raw',
      key: '1',
      children: <RawLensRenderer response={response} />,
    },
    {
      label: 'Headers',
      key: '2',
      children: <LensesHeadersRenderer headers={response.headers} />,
    },
  ];
  return (
    <div>
      <Tabs items={items} />
      {/*<div ref={jsonResponse}></div>*/}
    </div>
  );
};

export default LensesResponseBodyRenderer;

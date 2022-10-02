import { json } from '@codemirror/lang-json';
import { Tabs } from 'antd';
import { useRef } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import HttpParameters from '../http/Parameters';
import LensesHeadersRenderer from './HeadersRenderer';

const LensesResponseBodyRenderer = ({ response }) => {
  const jsonResponse = useRef(null);

  useCodeMirror({
    container: jsonResponse.current,
    value: 'response',
    height: '300px',
    extensions: [json()],
  });
  const items = [
    {
      label: 'Raw',
      key: '1',
      children: (
        <div
        />
      ),
    },
    {
      label: 'Headers',
      key: '0',
      children: (
        <LensesHeadersRenderer
          headers={[
            { key: 'bdpagetype', value: '2' },
            { key: 'bdqid', value: '0xaca2c41d0015733b' },
            { key: 'cache-control', value: 'private' },
            { key: 'connection', value: 'keep-alive' },
            { key: 'content-encoding', value: 'gzip' },
            { key: 'content-type', value: 'text/html;charset=utf-8' },
            { key: 'date', value: 'Sun, 02 Oct 2022 03:11:52 GMT' },
            { key: 'expires', value: 'Sun, 02 Oct 2022 03:11:51 GMT' },
            { key: 'isprivate', value: '1' },
            { key: 'server', value: 'BWS/1.1' },
            { key: 'strict-transport-security', value: 'max-age=172800' },
            { key: 'traceid', value: '1664680312062997709812439720749585232699' },
            { key: 'transfer-encoding', value: 'chunked' },
            { key: 'x-frame-options', value: 'sameorigin' },
            { key: 'x-ua-compatible', value: 'IE=Edge,chrome=1' },
          ]}
        />
      ),
    },

  ];
  return (
    <div>
      <Tabs items={items} />
      <div ref={jsonResponse}></div>
    </div>
  );
};

export default LensesResponseBodyRenderer;

import { json } from '@codemirror/lang-json';
import { useMount } from 'ahooks';
import { Button } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { css, RedocStandalone } from 'redoc';

import { useCodeMirror } from '../components/arex-request/helpers/editor/codemirror';

const EditRedoc = () => {
  const rawBodyParameters = useRef(null);

  const [value, setValue] = useState('');

  const [subValue, setSubValue] = useState('');

  useMount(() => {
    axios
      .post('http://127.0.0.1:8000/api/getdoc', {
        docId: '6399effaf6a6ce1b29629684',
      })
      .then((res) => {
          // console.log(res.data)
        setValue(JSON.stringify(JSON.parse(res.data.content), null, 2));
      });
  });

  useCodeMirror({
    container: rawBodyParameters.current,
    value: value,
    height: '100vh',
    extensions: [json()],
    theme: 'light',
    onChange: (val: string) => {
      setSubValue(val);
    },
  });
  return (
    <div>
      <Button
        onClick={() => {
          console.log(subValue);

          axios
            .post('/api/udpdoc', {
              docId: '6399effaf6a6ce1b29629684',
              content: subValue,
            })
            .then((res) => {
              console.log(res);
            });
        }}
      >
        提交
      </Button>
      <div
        css={css`
          display: flex;
          height: 100vh;
        `}
      >
        <div css={css`width: 50%`}>
            <div ref={rawBodyParameters}></div>
        </div>
        {subValue !== '' ? (
          <div>
            <RedocStandalone
              spec={JSON.parse(subValue)}
              options={{
                nativeScrollbars: true,
                theme: { colors: { primary: { main: '#dd5522' } } },
                  hideLoading:true
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EditRedoc;

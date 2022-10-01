import { json } from '@codemirror/lang-json';
import {Radio, RadioChangeEvent} from 'antd';
import {useRef, useState} from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import {css} from "@emotion/react";
import RawBody from "./RawBody";

const HttpBody = ({data}) => {
  const [value1, setValue1] = useState('Apple');
  const plainOptions = ['none', 'form-data', 'x-www-form-urlencoded','raw','binary'];
  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio1 checked', value);
    setValue1(value);
  };
  const rawBodyRef = useRef(null)
  return (
    <div>
      <div css={css`display: flex;justify-content: space-between`}>
        <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />

        <div>
          {/*右边操作的区域*/}
          <a onClick={()=>rawBodyRef.current.prettifyRequestBody()}>beautify</a>
        </div>
      </div>

      <RawBody cRef={rawBodyRef} data={data}/>
    </div>
  );
};

export default HttpBody;

import { css } from '@emotion/react';
import { Radio, RadioChangeEvent } from 'antd';
import { useContext, useRef, useState } from 'react';

import RawBody from './RawBody';
import { HttpContext } from '../../index';
import { getValueByPath } from '../../helpers/utils/locale';

const HttpBody = ({ data, theme }) => {
  const { store, dispatch } = useContext(HttpContext);
  const t = (key) => getValueByPath(store.locale, key);
  const [value1, setValue1] = useState('application/json');
  const plainOptions = ['application/json'];
  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio1 checked', value);
    setValue1(value);
  };
  const rawBodyRef = useRef(null);
  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        `}
      >
        <Radio.Group options={plainOptions} onChange={onChange1} value={value1} />

        <div>
          {/*右边操作的区域*/}
          <a onClick={() => rawBodyRef.current.prettifyRequestBody()}>{t('action.prettify')}</a>
        </div>
      </div>

      <RawBody theme={theme} cRef={rawBodyRef} data={data} />
    </div>
  );
};

export default HttpBody;

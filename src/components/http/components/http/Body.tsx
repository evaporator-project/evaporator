import { css } from '@emotion/react';
import { Radio, RadioChangeEvent } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RawBody from './RawBody';
const HttpBody = () => {
  const { t } = useTranslation();

  const [value1, setValue1] = useState('application/json');
  const plainOptions = ['application/json'];
  const onChange1 = ({ target: { value } }: RadioChangeEvent) => {
    setValue1(value);
  };
  const rawBodyRef = useRef<any>(null);

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
          margin: 6px 0;
        `}
      >
        <Radio.Group
          options={plainOptions}
          onChange={onChange1}
          value={value1}
        />
        <div>
          <a onClick={() => rawBodyRef.current.prettifyRequestBody()}>
            {t('action.prettify')}
          </a>
        </div>
      </div>

      <RawBody cRef={rawBodyRef} />
    </div>
  );
};

export default HttpBody;

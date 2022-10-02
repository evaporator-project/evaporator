import styled from '@emotion/styled';
import { useImmer } from 'use-immer';
import { HoppRESTParam } from '../../data/rest';

import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpHeaders = () => {
  const [requestParams, setRequestParams] = useImmer<HoppRESTParam[]>([
    { key: '', value: '', active: true },
  ]);
  return (
    <div>
      <p>{JSON.stringify(requestParams)}</p>
      <FormHeader update={setRequestParams} />
      <FormTable
        bordered
        size='small'
        rowKey='id'
        pagination={false}
        dataSource={requestParams}
        columns={useColumns(setRequestParams, true)}
      />
    </div>
  );
};

export default HttpHeaders;

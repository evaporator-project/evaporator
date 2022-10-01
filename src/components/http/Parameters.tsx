import styled from '@emotion/styled';
import { useImmer } from 'use-immer';

import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpParameters = () => {
  const [requestParams, setRequestParams] = useImmer<KeyValueType[]>([
    { key: '', value: '', active: true },
  ]);
  return (
    <div>
      {JSON.stringify(requestParams)}
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

export default HttpParameters;

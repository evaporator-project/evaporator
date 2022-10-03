import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import { useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { HoppRESTParam } from '../../data/rest';
import { HttpContext } from '../panes/Request';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpParameters = () => {
  const { store, dispatch } = useContext(HttpContext);
  const [requestParams, setRequestParams] = useImmer<HoppRESTParam[]>([
    { key: '', value: '', active: true },
  ]);
  useMount(() => {
    setRequestParams(store.request.params);
  });

  useEffect(() => {
    dispatch({
      type: 'setRequestParams',
      payload: requestParams,
    });
  }, [requestParams]);
  return (
    <div>
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

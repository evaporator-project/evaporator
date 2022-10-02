import styled from '@emotion/styled';
import { useMount } from 'ahooks';
import { useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';

import { HoppRESTParam } from '../../data/rest';
import { ColorContext } from '../panes/Request';
import FormHeader from './FormHeader';
import FormTable, { KeyValueType, useColumns } from './FormTable';

const HttpParameters = () => {
  const { store, dispatch } = useContext(ColorContext);
  const [requestParams, setRequestParams] = useImmer<HoppRESTParam[]>([
    { key: '', value: '', active: true },
  ]);

  function isEq(a, b) {
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return true;
    } else {
      return false;
    }
  }

  useMount(() => {
    console.log('123');
    setRequestParams(store.request.params);
    // console.log(store.request.params, requestParams,'store.request.params, requestParams')
  });

  useEffect(() => {
    dispatch({
      type: 'setRequestParams',
      payload: requestParams,
    });
  }, [requestParams]);
  return (
    <div>
      <p>{JSON.stringify(requestParams)}</p>
      <p>test:{JSON.stringify(store.request.params)}</p>
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

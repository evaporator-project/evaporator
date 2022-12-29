import { Table } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';

import { MainContext } from '../../store/content/MainContent';
import FormHeader from '../http/components/http/FormHeader';
import FormTable, { useColumns } from '../http/components/http/FormTable';

const EnvironmentPane = ({ pane }) => {
  console.log({ pane });
  const { store, dispatch } = useContext(MainContext);
  console.log(store.globalState.environments);
  const dataSource = useMemo(() => {
    return (
      store.globalState.environments.find((e) => e.name === pane.key)
        ?.variables || []
    );
  }, [store.globalState.environments]);
  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
    },
    {
      title: 'value',
      dataIndex: 'value',
    },
  ];

  const [requestHeaders, setRequestHeaders] = useImmer<any>([]);

  useEffect(() => {
    // setRequestHeaders(
    //     store.request.headers.map((i: any) => ({
    //       ...i,
    //       id: String(Math.random()),
    //     }))
    // );
    if (requestHeaders.length === 0) {
      setRequestHeaders(
        (
          store.globalState.environments.find((e) => e.name === pane.key)
            ?.variables || []
        ).map((m: any) => ({
          ...m,
          active: true,
        }))
      );
    }
  }, [store.globalState.environments]);

  useEffect(() => {
    // dispatch((state) => {
    //   state.request.headers = requestHeaders;
    // });

    dispatch((state) => {
      if (state.globalState.environments[0]) {
        state.globalState.environments[0].variables = requestHeaders;
      }
    });
  }, [requestHeaders]);
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />

      <FormHeader update={setRequestHeaders} title={'env'} />
      <FormTable
        bordered
        size="small"
        rowKey={'id'}
        pagination={false}
        dataSource={requestHeaders}
        // @ts-ignore
        columns={useColumns(setRequestHeaders, true)}
      />
    </div>
  );
};

export default EnvironmentPane;

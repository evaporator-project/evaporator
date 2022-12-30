import { Button, Input, message, Table } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import request from '../../services/request';
import { MainContext } from '../../store/content/MainContent';
import FormHeader from '../http/components/http/FormHeader';
import FormTable, { useColumns } from '../http/components/http/FormTable';

const EnvironmentPane = ({ pane }: any) => {
  const params = useParams();
  const { store, dispatch } = useContext(MainContext);
  const [requestHeaders, setRequestHeaders] = useImmer<any>([]);

  useEffect(() => {
    setRequestHeaders(
      (
        store.globalState.environments.find(
          (environment) => environment.id === pane.rawId
        )?.variables || []
      ).map((m: any) => ({
        ...m,
        active: true,
      }))
    );
  }, [store.globalState.environments]);

  const index = useMemo(
    () =>
      store.globalState.environments.findIndex((e) => {
        console.log(e.id, params.paneId);
        return e.id === params.paneId;
      }),
    [store.globalState.environments]
  );

  return (
    <div>
      <Button
        onClick={() => {
          dispatch((state) => {
            state.globalState.environments[index].variables =
              requestHeaders.map((r: any) => ({
                key: r.key,
                value: r.value,
              }));
          });

          const envs = JSON.parse(
            JSON.stringify(store.globalState.environments)
          );
          envs[index].variables = requestHeaders.map((r: any) => ({
            key: r.key,
            value: r.value,
          }));

          request({
            method: 'POST',
            url: '/api/updateworkspace',
            data: {
              id: params.workspaceId,
              environments: envs,
            },
          }).then((res) => {
            console.log(res);
            message.success(JSON.stringify(res));
          });
        }}
      >
        保存
      </Button>
      <Input
        value={store.globalState.environments[index].name}
        onChange={(e) => {
          dispatch((state) => {
              state.globalState.environments[index].name = e.target.value;
          });
        }}
      />
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

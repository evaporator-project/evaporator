// @ts-nocheck
import { css } from '@emotion/react';
import { message } from 'antd';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { treeFind } from '../../helpers/collection/util';
// import Http from './../../components/http'
import { AgentAxiosAndTest } from '../../helpers/request';
import request from '../../services/request';
import { useStore } from '../../store';
import Http from '../arex-request';
const RequestPane: FC<any> = ({ pane }) => {
  const { collectionTreeData } = useStore();
  // console.log(treeFind(collectionTreeData, (node) => node.key === pane.key));
  const { relationshipRequestId } = treeFind(
    collectionTreeData,
    (node) => node.key === pane.key
  );
  return (
    <div
      css={css`
        height: calc(100vh - 125px);
      `}
    >
      <Http
        currentRequestId={'123'}
        onEdit={(e: any) => {
          if (e.type === 'retrieve') {
            return request({
              method: 'POST',
              url: '/api/retrieverequest',
              data: {
                id: relationshipRequestId,
              },
            });
          } else if (e.type === 'update') {
            console.log(e);
            return request({
              method: 'POST',
              url: '/api/updaterequest',
              data: {
                id: relationshipRequestId,
                ...e.payload,
              },
            }).then((res) => {
              message.info(JSON.stringify(res));
            });
          }
        }}
        onSend={(e: any) => {
          return AgentAxiosAndTest(e);
        }}
      />
    </div>
  );
};

export default RequestPane;

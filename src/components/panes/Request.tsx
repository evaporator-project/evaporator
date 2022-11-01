import styled from '@emotion/styled';
import { message, Tag } from 'antd';
import { FC, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { HoppRESTRequest } from '../../data/rest';
import { treeFind } from '../../helpers/collection/util';
import { AgentAxiosAndTest } from '../../helpers/request';
import { FileService } from '../../services/FileService';
import request from '../../services/request';
import { useStore } from '../../store';
// import ArexRequestComponent from '../components/ArexRequestComponent/lib';
// import { convertRequestData } from '../components/ArexRequestComponent/util';
// import { treeFind } from '../helpers/collection/util';
// // import { parseGlobalPaneId } from '../helpers/utils';
// import { FileSystemService } from '../services/FileSystem.service';
// import { useStore } from '../store';
// import { PageFC } from './index';
// import { AgentAxiosAndTest } from '../helpers/request';
import Http from '../ArexRequestComponent/lib';
import { convertRequestData } from '../ArexRequestComponent/util';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

const RequestPage: FC<any> = ({ id, updateCol }) => {
  const { themeClassify, collectionTreeData } = useStore();
  const { workspaceId } = useParams();

  const nodeType = 1;

  const nId = useMemo(() => {
    return treeFind(collectionTreeData, (node) => node.key === id).relationshipRequestId;
  }, [id]);
  console.log(nId, 'nId');
  return (
    <Http
      currentRequestId={id}
      onEdit={(e) => {
        console.log(nodeType, 'nodeType');
        if (e.type === 'retrieve') {
          return request<HoppRESTRequest>({
            method: 'POST',
            url: `/api/retrieverequest`,
            data: { id: nId },
          })
        } else if (e.type === 'update') {
          console.log(e.payload);
          return request<HoppRESTRequest>({
            method: 'POST',
            url: `/api/updaterequest`,
            data: { id: nId, ...e.payload },
          }).then(res=>message.success('success'));;
        }
      }}
      requestExtraTabItems={[]}
      onSend={(e) => {
        return AgentAxiosAndTest(e);
      }}
    />
  );
};

export default RequestPage;

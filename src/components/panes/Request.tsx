import styled from '@emotion/styled';
import { message, Tag } from 'antd';
import { FC, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';

// import ArexRequestComponent from '../components/ArexRequestComponent/lib';
// import { convertRequestData } from '../components/ArexRequestComponent/util';
// import { treeFind } from '../helpers/collection/util';
// // import { parseGlobalPaneId } from '../helpers/utils';
// import { FileSystemService } from '../services/FileSystem.service';
// import { useStore } from '../store';
// import { PageFC } from './index';
// import { AgentAxiosAndTest } from '../helpers/request';
import ArexRequestComponent from '../ArexRequestComponent/lib';
import { convertRequestData } from '../ArexRequestComponent/util';
import { useStore } from '../../store';
import { FileService } from '../../services/FileService';
import request from '../../services/request';
import { HoppRESTRequest } from '../../data/rest';
import { AgentAxiosAndTest } from '../../helpers/request';
import { treeFind } from '../../helpers/collection/util';

export type KeyValueType = {
  key: string;
  value: string;
  active?: boolean;
};

const RequestPage: FC<any> = ({id, updateCol}) => {
  const {
    themeClassify,
    collectionTreeData,
  } = useStore();
  const { workspaceId } = useParams();

  const nodeType = 1

  const nId = useMemo(()=>{
    return treeFind(collectionTreeData,node=>node.key === id).relationshipRequestId
  },[id])
  console.log(nId,'nId')
  return (
    <ArexRequestComponent
      locale={'en'}
      theme={themeClassify}
      currentRequestId={id}
      collectionTreeData={collectionTreeData}
      envData={[]}
      currentEnvId={'aa'}
      onEdit={(e) => {
        console.log(nodeType, 'nodeType');
        if (e.type === 'retrieve') {
          return request<HoppRESTRequest>({
            method: 'POST',
            url: `/api/retrieverequest`,
            data: { id: nId },
          });
        } else if (e.type === 'update') {
          console.log(e.payload);
          // return updateRequestById(e.payload);
          // FileSystemService.saveInterface({
          //   workspaceId: workspaceId,
          //   id: id,
          //   address: {
          //     endpoint: e.payload.endpoint,
          //     method: e.payload.method,
          //   },
          //   body: e.payload.body,
          //   headers: e.payload.headers,
          //   params: e.payload.params,
          //   testScript: e.payload.testScript,
          // }).then((res) => {
          //   if (res.body.success) {
          //     message.success('success');
          //   }
          // });
        }
      }}
      requestExtraTabItems={[]}
      onSend={(e)=>{
        return AgentAxiosAndTest(e)
      }}
    />
  );
};

export default RequestPage;

import { css } from '@emotion/react';
import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';

import HttpRequest from './http/Request';
import { treeFind } from '../helpers/collection/util';
import { FileService } from '../services/FileService';
import request from '../services/request';
import { useStore } from '../store';

const RequestPage = ({ id }) => {
  console.log(id,'id')
  const { collectionTreeData } = useStore();
  const realId = useMemo(() => {
    return treeFind(collectionTreeData, (node) => {
      console.log(node.key , id)
      return node.key === id
    })?.relationshipRequestId;
  }, [id]);

  const {
    data,
    loading,
    run: fetchTreeData,
  } = useRequest(
    () => {
      const a = treeFind(collectionTreeData, (node) => node.key === id);
      return request({ method: 'POST', url: `/api/retrieverequest`,data:{id:a?.relationshipRequestId} });
    },
    {
      onSuccess: (res) => {
        console.log(res, 'res');
        // setCollectionTreeData(res)
        // setColl
      },
    },
  );

  return (
    <div
      css={css`
        background-color: white;
        height: 1500px;
      `}
    >
      {data ? <HttpRequest id={realId} pid={id} data={data}></HttpRequest> : null}
    </div>
  );
};

export default RequestPage;

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Breadcrumb, Button, Input, message, Select } from 'antd';
import { useContext, useEffect, useMemo, useRef } from 'react';

import { METHODS } from '../../constant';
import { treeFindPath } from '../../helpers/collection/util';
import AgentAxios from '../../helpers/request';
import { FileService } from '../../services/FileService';
import request from '../../services/request';
import { useStore } from '../../store';
import { requestUseStore } from '../../store/request';
import { HttpContext } from '../panes/Request';
import { readableBytes } from '../../helpers/http/responseMeta';

const HeaderWrapper = styled.div`
  display: flex;

  .ant-select > .ant-select-selector {
    width: 120px;
    left: 1px;
    border-radius: 2px 0 0 2px;
    .ant-select-selection-item {
      font-weight: 500;
    }
  }
  .ant-input {
    border-radius: 0 2px 2px 0;
  }
  .ant-btn-group,
  .ant-btn {
    margin-left: 16px;
  }
`;
const RequestTypeOptions = METHODS.map((method) => ({
  label: method,
  value: method,
}));
const HttpRequest = ({ id, pid, updateCol }) => {
  const { store, dispatch } = useContext(HttpContext);
  const { collectionTreeData, setCollectionTreeData } = useStore();
  const handleUrlChange = (value: string) => {
    dispatch({
      type: 'setRequestEndpoint',
      payload: value,
    });
  };
  const nodeInfoInCollectionTreeData = useMemo(() => {
    const paths = treeFindPath(collectionTreeData, (node) => {
      return node.relationshipRequestId === id;
    });
    return {
      self: paths[paths.length - 1],
      parent: paths[paths.length - 2],
      raw: paths,
    };
  }, [collectionTreeData, id]);

  const handleRequest = () => {

    dispatch({
      type: 'setResponseType',
      payload: 'loading',
    });

    const start = new Date().getTime()
    AgentAxios({
      method: store.request.method,
      url: store.request.endpoint,
      headers: {},
      data: ['GET'].includes(store.request.method)?undefined:JSON.parse(store.request.body.body),
      // parm: ['GET'].includes(store.request.method)?undefined:JSON.parse(store.request.body.body)
    }).then((res: any) => {
      setTimeout(()=>{
        const end = new Date().getTime()
        console.log(res,'res')



        dispatch({
          type: 'setResponseType',
          payload: 'success',
        });



        dispatch({
          type: 'setResponseBody',
          payload: JSON.stringify(res.data),
        });
        dispatch({
          type: 'setResponseHeaders',
          payload: res.headers,
        });


        dispatch({
          type: 'setResponseMeta',
          payload: {
            responseSize: JSON.stringify(res.data).length,
            responseDuration: end - start,
          },
        });

        dispatch({
          type: 'setResponseStatuscode',
          payload: res.status,
        });
      },1000)
    });
  };

  const {
    data: treeData = [],
    loading,
    run: fetchTreeData,
  } = useRequest(() => FileService.getcollectiontree({}), {
    onSuccess: (res) => {
      setCollectionTreeData(res);
    },
  });

  // 更新
  const { run: saveRequest } = useRequest(
    () => {
      return request({
        method: 'POST',
        url: `/api/updaterequest`,
        data: {
          id,
          method: store.request.method,
          endpoint: store.request.endpoint,
          body: store.request.body,
          params: store.request.params,
          headers: store.request.headers,
        },
      });
    },
    {
      manual: true,
      onSuccess() {
        message.success('更新成功');
        updateCol();
      },
    },
  );
  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <Breadcrumb style={{ paddingBottom: '14px' }}>
          {nodeInfoInCollectionTreeData.raw.map((i, index) => (
            <Breadcrumb.Item key={index}>{i.title}</Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div>
          <Button
            onClick={() => {
              saveRequest();
            }}
          >
            Save
          </Button>
        </div>
      </div>
      <HeaderWrapper>
        <Select
          value={store.request.method}
          options={RequestTypeOptions}
          onChange={(value) => {
            console.log(value, 'va');
            dispatch({
              type: 'setRequestMethod',
              payload: value,
            });
          }}
        />
        <Input
          placeholder={'http.enterRequestUrl'}
          value={store.request.endpoint}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
        <Button type='primary' onClick={handleRequest}>
          Send
        </Button>
      </HeaderWrapper>
    </div>
  );
};

export default HttpRequest;

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
import { ColorContext } from '../panes/Request';

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
const HttpRequest = ({ id, pid, data, updateCol }) => {
  const { store, dispatch } = useContext(ColorContext);
  const { collectionTreeData, setCollectionTreeData } = useStore();
  const handleUrlChange = (value: string) => {
    // setEndpoint(value);
    dispatch({
      type: 'setEndpoint',
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

  // 数据初始化
  useEffect(() => {
    // setEndpoint(data.endpoint);
    console.log(data.endpoint, 'endpoint');
    dispatch({
      type: 'setEndpoint',
      payload: data.endpoint,
    });
    dispatch({
      type: 'setMethod',
      payload: data.method || 'POST',
    });
  }, [data]);
  const handleRequest = () => {
    console.log(store.request.params,'raw')
    AgentAxios({
      method: store.method,
      url: store.endpoint,
      // data: JSON.parse(store.rawParamsBody),
      headers: {
        cookie: '',
      },
      // data: body,
    }).then((res: any) => {
      // console.log(res,'res')
      dispatch({
        type: 'setResponse',
        payload: JSON.stringify(res.data),
      });
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
          method: store.method,
          endpoint: store.endpoint,
          body: store.rawParamsBody,
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
          value={store.method}
          options={RequestTypeOptions}
          onChange={(value) => {
            dispatch({
              type: 'setMethod',
              payload: value,
            });
          }}
        />
        <Input
          placeholder={'http.enterRequestUrl'}
          value={store.endpoint}
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

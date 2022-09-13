import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import {Breadcrumb, Button, Input, message, Select} from 'antd';
import * as monaco from 'monaco-editor';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { MethodEnum, METHODS } from '../../constant';
import { treeFindPath } from '../../helpers/collection/util';
import AgentAxios from '../../helpers/request';
import request from '../../services/request';
import { useStore } from '../../store';
import {FileService} from "../../services/FileService";

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

// TODO 暂时就坐到这里
const HttpRequest = ({ id, pid, data,updateCol }) => {
  // const {setCollectionTreeData} = useStore
  const { collectionTreeData, extensionInstalled, setPanes, setCollectionTreeData } = useStore();
  const [method, setMethod] = useState<typeof METHODS[number]>(MethodEnum.GET);
  const [url, setUrl] = useState('');
  const handleUrlChange = (value: string) => {
    setUrl(value);
  };

  // 如果是case(2)类型的话，就一定有一个父节点，类型也一定是request(1)
  const nodeInfoInCollectionTreeData = useMemo(() => {
    const paths = treeFindPath(collectionTreeData, (node) => {
      console.log(node.relationshipRequestId, id,'node.key === id')
      return node.relationshipRequestId === id
    });

    return {
      self: paths[paths.length - 1],
      parent: paths[paths.length - 2],
      raw: paths,
    };
  }, [collectionTreeData, id]);



  // 数据初始化
  useEffect(() => {
    setUrl(data.endpoint);
    setMethod(data.method || 'POST');
  }, [data]);

  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl && !editor) {
      setEditor(
        monaco.editor.create(monacoEl.current!, {
          value: '',
          language: 'json',
          fontSize: 16,
          fontFamily: 'monaco',
          minimap: {
            enabled:false
          }
        })
      );
    }
    editor?.setValue(data.body)
    return () => editor?.dispose();
  }, [monacoEl.current]);


  const [editor2, setEditor2] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl2 = useRef(null);

  useEffect(() => {
    if (monacoEl2 && !editor2) {
      setEditor2(
        monaco.editor.create(monacoEl2.current!, {
          value: '',
          language: 'json',
          fontSize: 16,
          fontFamily: 'monaco',
          minimap: {
            enabled:false
          }
        })
      );
    }

    return () => editor2?.dispose();
  }, [monacoEl2.current]);

  // 发请求
  const handleRequest = () => {
    AgentAxios({
      method: method,
      url,
      // data: body,
    }).then((res: any) => {
      editor2?.setValue(JSON.stringify(res.data, null, 2));
    });
  };



  const {
    data: treeData = [],
    loading,
    run: fetchTreeData,
  } = useRequest(() => FileService.getcollectiontree({}), {
    onSuccess: (res) => {
      console.log(res, 'res');
      setCollectionTreeData(res);
      // setColl
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
          method,
          endpoint: url,
          body: editor?.getValue(),
        },
      });
    },
    {
      manual: true,
      onSuccess(){
        message.success('更新成功')



        updateCol()



      }
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
        <Select value={method} options={RequestTypeOptions} onChange={setMethod} />
        <Input
          placeholder={'http.enterRequestUrl'}
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
        <Button type='primary' onClick={handleRequest}>
          Send
        </Button>
      </HeaderWrapper>

      {/*reqBody*/}
      <div className='Editor' ref={monacoEl}></div>
      {/*res*/}
      <div className='Editor' ref={monacoEl2}></div>
    </div>
  );
};

export default HttpRequest;

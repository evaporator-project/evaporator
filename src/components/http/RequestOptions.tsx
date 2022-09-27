import { Tabs } from 'antd';
import HttpRawBody from "./RawBody";
import HttpBody from "./Body";
import {useEffect} from "react";
const { TabPane } = Tabs;
const HttpRequestOptions = ({data}) => {
  useEffect(()=>{
    console.log({data})
  },[data])
  // >=4.23.0 可用，推荐的写法 ✅
  const items = [
    { label: 'Params', key: '0', children: '内容 1' }, // 务必填写 key
    // { label: 'form-data', key: '1', children: '内容 2' },
    // { label: 'x-www-form-urlencoded', key: '2', children: '内容 2' },
    { label: 'Body', key: '3', children: <HttpBody data={data}/> },
    // { label: 'binary', key: '4', children: '内容 2' },
  ];
  return (
    <div>
      <Tabs activeKey={'3'} items={items}></Tabs>
    </div>
  );
};

export default HttpRequestOptions;

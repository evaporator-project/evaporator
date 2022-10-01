import { json } from '@codemirror/lang-json';
import { Button } from 'antd';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useCodeMirror } from '../../helpers/editor/codemirror';
import { requestUseStore } from '../../store/request';
import {ColorContext} from "../panes/Request";

const HttpRawBody = ({ data, cRef }) => {
  const rawBodyParameters = useRef(null);
  const { store, dispatch } = useContext(ColorContext);
  useEffect(() => {
    dispatch({
      type: 'setRawParamsBody',
      payload: data?.body,
    });
  }, [data]);

  useCodeMirror({
    container: rawBodyParameters.current,
    value: store.rawParamsBody,
    height: '300px',
    extensions: [json()],
    onChange: (val) => {
      dispatch({
        type: 'setRawParamsBody',
        payload: val,
      });
    },
  });

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(cRef, () => {
    // 需要将暴露的接口返回出去
    return {
      prettifyRequestBody: function () {
        prettifyRequestBody();
      },
    };
  });
  const prettifyRequestBody = () => {
    console.log(store.rawParamsBody, 'rawParamsBody');
    const jsonObj = JSON.parse(store.rawParamsBody);
    dispatch({
      type: 'setRawParamsBody',
      payload: JSON.stringify(jsonObj, null, 2),
    });
  };

  const handleName = (e) => {};

  return (
    <div>
      <div ref={rawBodyParameters}></div>
    </div>
  );
};

export default HttpRawBody;

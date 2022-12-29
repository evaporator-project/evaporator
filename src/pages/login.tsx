import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import request from '../services/request';
function getValue(search: any, key: any) {
  //找出key第一次出现的位置
  const start = search.indexOf(key);
  if (start == -1) {
    return;
  }
  //找出key最后出现的位置
  let end = search.indexOf('&', start);
  if (end == -1) {
    end = search.length;
  }
  //取出键值对
  const str = search.substring(start, end);
  //获取getValue
  const arr = str.split('=');
  return arr;
}

const Login = (props: any) => {
  const location = useLocation();
  const nav = useNavigate();
  useEffect(() => {
    const [_, code] = getValue(location.search, 'code');

    request({
      method: 'POST',
      url: '/api/oauth/token',
      data: { code },
    }).then((res: any) => {
      localStorage.setItem('token', res.token);
      nav('/');
    });
  }, []);
  return <div>login</div>;
};

export default Login;

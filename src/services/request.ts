import { message } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
const axiosInstance = axios.create({
  timeout: 30000, // 请求超时时间
});

const err = (error: any) => {
  if (error.response) {
    message.error(error.response.data.message);
  }
  return Promise.reject(error);
};

// request interceptor
axiosInstance.interceptors.request.use((config) => {
  if (localStorage.getItem('token')) {
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  }
  return config;
}, err);

// response interceptor
// axiosInstance.interceptors.response.use((response) => {
//   const { status: code, data, statusText: msg } = response;
//   return data;
// }, err);

function Request<T = unknown>(configParam: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve) => {
    axiosInstance.request<T, AxiosResponse<T>>(configParam).then((res) => {
      resolve(res.data);
    });
  });
}

export default Request;

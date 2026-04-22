// src/api/client.ts
// Axios 实例 — 统一管理所有 API 请求
// 好处：token 只需要在这里配置一次，所有请求自动带上

import axios from 'axios';

// const client = axios.create({
//   baseURL: 'http://localhost:8080/api/v1',
// });

const client = axios.create({
  baseURL: 'http://54.254.226.187:8080/api/v1',
});

// 请求拦截器 — 每个请求发出前自动加上 JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 — token 过期时自动跳回登录页
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
/** 对axios做一些配置 **/

import { baseUrl } from "../config";
import axios from "axios";
import { message } from "antd";

// import stringify from "qs-stringify";

// 不需要下面这些mock配置，仅本地发布DEMO用
// import Mock from "mockjs";
// const mock = require("../../mock/app-data");
// Mock.mock(/\/api.*/, (options: any) => {
//   const res = mock.mockApi(options);
//   return res;
// });

// 请求是否带上cookie
axios.defaults.withCredentials = false;
// 默认基础请求地址
axios.defaults.baseURL = baseUrl;
// 对返回的结果做处理
axios.interceptors.request.use(
  (config) => {
    // setDefaultParams(config)
    // refreshToken(config)
    const token = localStorage.getItem("token");
    config.headers.common["Authorization"] = "Bearer" + " " + token;
    return config;
  },
  (err) => {
    return Promise.resolve(err);
  }
);
axios.interceptors.response.use((response: any) => {
  const code = response?.code;
  // const code = response?.data?.code ?? 200;
  // 没有权限，登录超时，登出，跳转登录
  if (code === "TOKEN_INVAILD") {
    message.error("登录超时，请重新登录");
    sessionStorage.removeItem("userinfo");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  } else {
    return response.data;
  }
  return response.data;
});

export default axios;

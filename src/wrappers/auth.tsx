import { Navigate, Outlet } from "umi";
import React from "react";

// 用户管理的权限控制
export default () => {
  // 是否已登录的判断，相当于路由守卫
  let loginInfo = JSON.parse(localStorage.getItem("login-info") || `{}`);
  let isLogin = !!loginInfo?.token;

  if (isLogin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

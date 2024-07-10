import { menuRoutes } from "./MenuRoute";

export const routes = [
  {
    path: "/exception",
    layout: false,
    routes: [
      {
        key: "404",
        path: "/exception/404",
        component: "./exception/404",
      },
      {
        key: "403",
        path: "/exception/403",
        component: "./exception/403",
      },
    ],
  },
  {
    path: "/login",
    component: "@/pages/login", // 加载login登录页面
    layout: false,
  },
  {
    path: "/register",
    component: "@/pages/login/register", // 加载login注册页面
    layout: false,
  },
  // {
  //   path: "/tv",
  //   component: "@/pages/bgTv", // 加载tv开机动画
  //   layout: false,
  // },
  {
    path: "/",
    component: "@/layouts/SecurityLayout", // 主页加载layout公共组件
    layout: false,
    routes: [
      {
        path: "/",
        exact: true,
        hidden: true,
        redirect: "/home",
      },
      // ...menuRoutes,
    ],
  },
  {
    path: "*",
    component: "./exception/404",
    redirect: "/exception/404",
    layout: false,
  },
];

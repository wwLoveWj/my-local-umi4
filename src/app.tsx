import "./global.less";

import { ConfigProvider } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PayCircleOutlined,
  OpenAIOutlined,
  TagsOutlined,
  SendOutlined,
  BellOutlined,
  ReadOutlined,
  HomeOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import Package from "../package.json";
import React from "react";
import { getMenuListByRole } from "@/service/api/roles";
import { transformRoutes } from "@/utils";

let extraRoutes: any[];
// icon对应的dom映射
const iconMap = new Map([
  ["HomeOutlined", HomeOutlined],
  ["SendOutlined", SendOutlined],
  ["TagsOutlined", TagsOutlined],
  ["BellOutlined", BellOutlined],
  ["OpenAIOutlined", OpenAIOutlined],
  ["ReadOutlined", ReadOutlined],
  ["PayCircleOutlined", PayCircleOutlined],
  ["UserOutlined", UserOutlined],
]);
//  实现菜单所需数据的组合配置
const menuMatch = (data: any[]) => {
  const arr = data.map((item) => {
    if (item.children && item.children.length) {
      menuMatch(item.children);
    } else {
      // 重点是这里，拿到对应的js文件
      item.element = (function () {
        const PageComponent = (item.component = require("@/pages" +
          item.component).default);
        return <PageComponent />;
      })();
    }
    return {
      title: item.title,
      element: item.element,
      component: item.component,
      children: item.children,
      path: item.path,
      icon: iconMap.get(item.icon),
      key: item.key,
      // id: (item.id + 7).toString(),
      // parentId: "6",
    };
  });
  return arr;
};
// 初始化路由菜单数据
export async function getInitialState() {
  const routesData = await getMenuListByRole({ menuIds: "1, 2, 3, 4" });
  const routes = menuMatch(transformRoutes(routesData, 0, 0));
  return {
    menuRoutes: routes,
  };
}
// 应用启动时动态加载路由
export async function patchClientRoutes({ routes }: { routes: any[] }) {
  const arr = menuMatch(extraRoutes);
  routes[3].routes.push(...arr);
}

export function rootContainer(container: React.ReactNode) {
  ConfigProvider.config({
    prefixCls: Package.name + "-ant",
  });
  return (
    <ConfigProvider prefixCls={Package.name + "-ant"}>
      {container}
    </ConfigProvider>
  );
}

export async function render(oldRender: any) {
  const res = await getMenuListByRole({ menuIds: "1, 2, 3, 4" });
  extraRoutes = transformRoutes(res, 0, 0);
  oldRender();
}

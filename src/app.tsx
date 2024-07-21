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
  RobotOutlined,
  KeyOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Package from "../package.json";
import React from "react";
import vstores from "vstores";

let loginInfo = vstores.get("login-info");
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
  ["RobotOutlined", RobotOutlined],
  ["KeyOutlined", KeyOutlined],
  ["SettingOutlined", SettingOutlined],
]);
//  实现菜单所需数据的组合配置
const menuMatch = (data: any[]) => {
  const arr = data.map((item) => {
    if (item.children && item.children.length) {
      menuMatch(item.children);
    } else {
      // 重点是这里，拿到对应的js文件
      item.element = (function () {
        const PageComponent = (item.component =
          item.component &&
          require("@/pages" + item.component?.split(".")[1]).default);
        return <PageComponent />;
      })();
    }
    return {
      title: item.title,
      element: item.element,
      component: item.component,
      routes: item.children,
      children: item.children,
      path: item.path,
      icon: iconMap.get(item.icon),
      isHidden: item.isHidden,
      id: item.id,
    };
  });
  return arr;
};
// 初始化路由菜单数据
export async function getInitialState() {
  return {
    menuRoutes: menuMatch(loginInfo?.extraRoutes) || [],
  };
}
// 应用启动时动态加载路由
export async function patchClientRoutes({ routes }: { routes: any[] }) {
  routes[3].routes.push(...(loginInfo?.extraRoutes || []));
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
  oldRender();
}

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
} from "@ant-design/icons";
import Package from "../package.json";
import React from "react";
import { getMenuIdsByroleIdByUserId } from "@/service/api/roles";
import { getMenuListByRole } from "@/service/api/roles";
import { transformRoutes } from "@/utils";

let extraRoutes: any[];
let menuIds = "";
let loginInfo = JSON.parse(localStorage.getItem("login-info"));
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
      key: item.id,
      isHidden: item.isHidden,
      id: item.id,
      // id: (item.id + 7).toString(),
      // parentId: "6",
    };
  });
  return arr;
};
// 初始化路由菜单数据
export async function getInitialState() {
  return {
    menuRoutes: extraRoutes,
  };
}
// 应用启动时动态加载路由
export async function patchClientRoutes({ routes }: { routes: any[] }) {
  if (menuIds?.length > 0) {
    routes[3].routes.push(...extraRoutes);
  }
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
  if (loginInfo?.userId) {
    // 根据id通过链表查询到menusId
    const result = await getMenuIdsByroleIdByUserId({
      userId: loginInfo?.userId,
    });

    menuIds = result[0]?.menuIds;
  }

  if (menuIds?.length > 0) {
    const routesData = await getMenuListByRole({
      menuIds,
    });
    extraRoutes = menuMatch(transformRoutes(routesData, 0, 0));
    localStorage.setItem("menus", JSON.stringify(extraRoutes));
  }
  oldRender();
}

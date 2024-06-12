import React, { useState, useEffect } from "react";
import BasicLayout from "./basicLayout/index";
import type { MenuProps } from "antd";
import { history, useIntl } from "umi";
import { PROJECT_CONFIG } from "@/constant/config";

// settings的菜单
const avatarItems: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        onClick={() => {
          history.push("/login");
          localStorage.clear();
        }}
      >
        退出登录
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          history.push("/center");
        }}
      >
        个人中心
      </a>
    ),
  },
];
const SecurityLayout = () => {
  // 国际化配置
  const intl = useIntl();
  const lang = intl.locale;
  const [rolesList] = useState([]); //账户权限，后面需要根据后端接口接收返回
  return (
    <BasicLayout
      avatarItems={avatarItems}
      rolesList={rolesList}
      projectName={
        lang === "en-US" ? PROJECT_CONFIG.NAME : PROJECT_CONFIG.TITLE
      }
    />
  );
};

export default SecurityLayout;

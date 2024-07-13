import React, { useState, useEffect } from "react";
import BasicLayout from "./basicLayout/index";
import type { MenuProps } from "antd";
import { FloatButton } from "antd";
import { OpenAIOutlined } from "@ant-design/icons";
import { history, useIntl } from "umi";
import { PROJECT_CONFIG } from "@/constant/config";
import ChatBot from "@/pages/chatBot";
import styles from "./basicLayout/style.less";

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
  const [visible, setBotVisible] = useState(false); //控制机器人的显示隐藏
  // 国际化配置
  const intl = useIntl();
  const lang = intl.locale;
  const [rolesList] = useState([]); //账户权限，后面需要根据后端接口接收返回
  // 关闭机器人弹窗
  const onClose = () => {
    setBotVisible(false);
  };
  return (
    <>
      <BasicLayout
        avatarItems={avatarItems}
        rolesList={rolesList}
        projectName={
          lang === "en-US" ? PROJECT_CONFIG.NAME : PROJECT_CONFIG.TITLE
        }
      />
      <FloatButton
        className={styles.ai}
        icon={<OpenAIOutlined />}
        tooltip={<div>星火大模型ai对话</div>}
        onClick={() => {
          setBotVisible(true);
        }}
      />
      <ChatBot visible={visible} onClose={onClose} />
    </>
  );
};

export default SecurityLayout;

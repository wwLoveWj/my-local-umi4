import { useLayoutContext } from "./LayoutProvider";
import { routes } from "@/routes";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useAliveController } from "react-activation";
import { history, useLocation, useIntl } from "umi";
import { pathTxt } from "./constant";
import style from "./style.less";
import type { TabTypes, TagTypes } from "./type";
import { getTagTitle } from "@/utils/index";
// import LabelDropdown from "./CloseTabs";

const { confirm } = Modal;

const PageTabs = () => {
  const { globalEditPages } = useLayoutContext();
  const { dropScope } = useAliveController();
  const { pathname } = useLocation();
  const [activeKey, setActiveKey] = useState<string>("/home");
  const [tabList, setTabList] = useState<any[]>([
    {
      label: "首页",
      key: "/home",
      closable: false,
    },
  ]);
  // 国际化配置
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  // 关闭页签
  const closeTab = (targetKey: any) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabList.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabList.filter((item) => item.key !== targetKey);
    // 判断页签是否为当前选中项，如果是则关闭设置选择项为当前页签的前一个页签，如果不是就直接关闭
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabList(newPanes);
    setActiveKey(newActiveKey);
    // 关闭页签清除keepalive缓存
    dropScope(targetKey);
    history.push(newActiveKey);
  };

  // 点击关闭tab标签
  const handleRemove = (targetKey: any, action: "add" | "remove") => {
    if (action === "remove") {
      // 是否存在编辑项
      const isEditing = globalEditPages[targetKey] || false;
      if (isEditing) {
        confirm({
          title: `${pathTxt[targetKey] || ""}`,
          icon: <ExclamationCircleOutlined />,
          okText: "关闭",
          cancelText: "取消关闭",
          onOk() {
            closeTab(targetKey);
          },
          onCancel() {},
        });
      } else {
        closeTab(targetKey);
      }
    }
  };

  // 点击tab切换路由
  const onChange = (newActiveKey: string) => {
    history.push(newActiveKey);
  };

  // 路由变化设置选择项
  const initSetTabs = (path: string) => {
    const pathList: string[] = [];
    tabList?.map((item: TabTypes) => {
      pathList.push(item.key);
    });
    // 判断当前路由是否在页签里，不在就加入页签
    if (!pathList.includes(path) && path !== "/") {
      const pathTitle = getTagTitle(path, routes);
      setTabList([...tabList, { label: t(pathTitle), key: path }]);
    }
    setActiveKey(path);
  };

  useEffect(() => {
    initSetTabs(pathname);
  }, [pathname]);

  return (
    <div className={style["user-page-tabs"]}>
      <Tabs
        size="small"
        type="editable-card"
        tabPosition={"top"}
        hideAdd
        style={{ height: 220 }}
        onChange={onChange}
        activeKey={activeKey}
        onEdit={handleRemove}
        items={tabList}
      />
      {/* 两者择其一 */}
      {/* <LabelDropdown /> */}
    </div>
  );
};

export default PageTabs;

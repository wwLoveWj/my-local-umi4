import { history, useLocation } from "umi";
import { useAliveController } from "react-activation";
import { Dropdown, Tabs } from "antd";
import React, { useState } from "react";
import "./style.less";

export default (): React.ReactElement => {
  const { pathname } = useLocation();

  // 获取缓存列表
  const { getCachingNodes, dropScope, clear, refreshScope } =
    useAliveController();
  const cachingNodes = getCachingNodes();
  const [open, setOpen] = useState<{ path: string; open: boolean }>({
    path: "",
    open: false,
  });

  // 阻止右键事件冒泡
  const onRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    name: string
  ) => open.open && open.path === name && e.stopPropagation();

  // 点击tab，跳转页面
  const clickTab = (path: string) => {
    history.push(path);
  };

  // 关闭tab，销毁缓存
  const editTab = (path: any) => {
    dropScope(path);
    // 关闭当前页面，需跳转到其他页签
    if (path === pathname) {
      const index = cachingNodes.findIndex((item) => item.name === path);
      if (index > 0) {
        history.push(cachingNodes[index - 1].name as string);
      } else {
        history.push(cachingNodes[1].name as string);
      }
    }
  };

  // 关闭当前页
  const onCurrent = (e: any) => {
    let targetKey = JSON.parse(e?.key).name;
    dropScope(targetKey);
    // 关闭当前页面，需跳转到其他页签
    if (targetKey === pathname) {
      const index = cachingNodes.findIndex((item) => item.name === targetKey);
      if (index > 0) {
        history.push(cachingNodes[index - 1].name as string);
      } else {
        history.push(cachingNodes[1].name as string);
      }
    }
  };

  // 关闭其他
  const onOther = (e: any) => {
    let targetKey = JSON.parse(e?.key).name;
    history.push(targetKey);
    clear();
  };

  //关闭左侧
  const onLeft = (e: any) => {
    let targetKey = JSON.parse(e?.key).name;
    const lastIndex = cachingNodes.findIndex((item) => item.name === pathname);
    const currIndex = cachingNodes.findIndex((item) => item.name === targetKey);
    if (currIndex > lastIndex) history.push(targetKey);
    cachingNodes.forEach((item, index) => {
      if (index < currIndex) {
        dropScope(item?.name || "");
      }
    });
  };

  // 关闭右侧
  const onRight = (e: any) => {
    let targetKey = JSON.parse(e?.key).name;
    const lastIndex = cachingNodes.findIndex((item) => item.name === pathname);
    const currIndex = cachingNodes.findIndex((item) => item.name === targetKey);
    if (currIndex < lastIndex) history.push(targetKey);
    cachingNodes.forEach((item, index) => {
      if (index > currIndex) {
        dropScope(item?.name || "");
      }
    });
  };

  // 关闭全部
  const onAll = () => {
    history.push("/home");
    clear();
  };

  // 重新加载
  const onRefresh = (e: any) => {
    let targetKey = JSON.parse(e?.key).name;
    refreshScope(targetKey);
  };

  const labelDropdown = (name: string, label: string) => {
    const lastIndex = cachingNodes.findIndex((item) => item.name === name);
    return (
      <div onClick={(e) => onRightClick(e, name)}>
        <Dropdown
          trigger={["contextMenu"]}
          onOpenChange={(e) => setOpen({ path: name, open: e })}
          menu={{
            items: [
              {
                label: "关闭当前",
                key: JSON.stringify({ name, key: "current" }),
                disabled: cachingNodes.length <= 1,
                onClick: onCurrent,
              },
              {
                label: "关闭其他",
                key: JSON.stringify({ name, key: "other" }),
                disabled: cachingNodes.length <= 1,
                onClick: onOther,
              },
              {
                label: "关闭左侧",
                key: JSON.stringify({ name, key: "left" }),
                disabled: lastIndex === 0,
                onClick: onLeft,
              },
              {
                label: "关闭右侧",
                key: JSON.stringify({ name, key: "right" }),
                disabled: lastIndex === cachingNodes.length - 1,
                onClick: onRight,
              },
              {
                label: "全部关闭",
                key: JSON.stringify({ name, key: "all" }),
                onClick: onAll,
                disabled: cachingNodes.length <= 1,
              },
              {
                label: "重新加载",
                key: JSON.stringify({ name, key: "refresh" }),
                onClick: onRefresh,
              },
            ],
          }}
        >
          <div className={cachingNodes.length > 1 ? "dropdown-label" : ""}>
            {label}
          </div>
        </Dropdown>
      </div>
    );
  };

  const tabItems = cachingNodes.map((item: any) => ({
    label: labelDropdown(item.name, item.tabName),
    key: item.name,
    closable: cachingNodes.length > 1,
  }));
  return (
    <Tabs
      hideAdd
      size="middle"
      type="editable-card"
      activeKey={pathname}
      onTabClick={clickTab}
      onEdit={editTab}
      items={tabItems}
    />
  );
};

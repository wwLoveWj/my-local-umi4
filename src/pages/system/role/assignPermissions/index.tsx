import React, { useState } from "react";
import { TreeSelect } from "antd";
import { ConfigurableModalForm } from "@/components/wwModalForm";
import { chgMenuIdsByRolename } from "@/service/api/roles";
import { useRequest } from "ahooks";
import vstores from "vstores";
import { findParentKey, childrenValuePush, getChildIds } from "@/utils";
const { SHOW_ALL } = TreeSelect;

const Index: React.FC<{ propsFromRoleTable: any }> = ({
  propsFromRoleTable,
}) => {
  const { closeModal, visible, form, allAuthInfo, onQueryList } =
    propsFromRoleTable;
  const [value, setValue] = useState<string | string[]>([]);
  let treeData = vstores.get("login-info")?.permissionMenuList;

  // 更改菜单权限的接口
  const chgMenuIdsByRolenameRun = useRequest(chgMenuIdsByRolename, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      onQueryList();
    },
  });
  //   勾选权限菜单的change事件
  const onChange = (
    newValueList: any[],
    _: any,
    parentIdInfo: { checked: boolean; triggerValue: number }
  ) => {
    // 父级取消了子级勾选全部去除
    if (!parentIdInfo?.checked) {
      const newArray = [...form.getFieldValue("menuIds")].filter(
        (item) =>
          !getChildIds(treeData, parentIdInfo?.triggerValue, []).includes(
            item?.value
          )
      );
      form.setFieldValue("menuIds", [...newArray]);
    }
    const newValue = newValueList.map((item) => item.value);
    setValue(newValue);
  };

  const onSelect = (id: number, node: any) => {
    // 子级选了父级一定勾选上
    findParentKey(treeData, id) &&
      form.setFieldValue("menuIds", [
        ...new Set([
          ...form.getFieldValue("menuIds"),
          id,
          findParentKey(treeData, id),
        ]),
      ]);
    // 父级选了子级一定全勾选上
    let keys = [...childrenValuePush(node, [])].filter(Boolean);
    form.setFieldValue("menuIds", [
      ...form.getFieldValue("menuIds"),
      id,
      ...keys,
    ]);
  };
  // 原文链接：https://blog.csdn.net/weixin_45456092/article/details/137560460
  //   树组件的props参数
  const tProps = {
    treeData,
    value,
    onChange,
    onSelect,
    treeDefaultExpandedKeys: allAuthInfo.menuIds?.split(","),
    fieldNames: { label: "title", value: "id" },
    treeCheckable: true,
    showCheckedStrategy: SHOW_ALL,
    treeCheckStrictly: true,
    placeholder: "请勾选需要展示的菜单",
    allowClear: true,
    style: {
      width: "100%",
    },
  };
  const formModalfields: any[] = [
    {
      name: "rolename",
      label: "角色名称",
      type: "input",
      formItemProps: {
        rules: [{ required: true, message: "请输入角色名称" }],
      },
      fieldProps: {
        disabled: true,
      },
    },
    {
      name: "menuIds",
      label: "选择权限",
      type: "treeSelect",
      //   render: () => <TreeSelect {...tProps} allowClear />,
      formItemProps: {
        rules: [{ required: true, message: "请选择对应的权限" }],
      },
      fieldProps: {
        ...tProps,
      },
    },
  ];
  //  弹窗的提交事件
  const handleOk = (values: Record<string, any>) => {
    const menuIds = values.menuIds?.map(
      (item: { value: string }) => item.value
    );
    let params = {
      ...values,
      menuIds: menuIds.join(),
      roleId: allAuthInfo?.roleId,
    };
    chgMenuIdsByRolenameRun.run(params);
    closeModal(); // 关闭弹窗
  };

  return (
    <ConfigurableModalForm
      title="角色权限分配"
      visible={visible}
      onOk={handleOk}
      onCancel={closeModal}
      formFields={formModalfields}
      form={form}
    />
  );
};

export default Index;

import React, { useState } from "react";
import { TreeSelect } from "antd";
import { ConfigurableModalForm } from "@/components/wwModalForm";
import { chgMenuIdsByRolename } from "@/service/api/roles";
import { useRequest } from "ahooks";
import vstores from "vstores";
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
  const onChange = (newValueList: any[]) => {
    const newValue = newValueList.map((item) => item.value);
    setValue(newValue);
  };
  //   树组件的props参数
  const tProps = {
    treeData,
    value,
    onChange,
    treeDefaultExpandedKeys: allAuthInfo.menuIds?.split(","),
    fieldNames: { label: "title", value: "id" },
    treeCheckable: true,
    showCheckedStrategy: SHOW_ALL,
    placeholder: "请勾选需要展示的菜单",
    allowClear: true,
    treeCheckStrictly: true,
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

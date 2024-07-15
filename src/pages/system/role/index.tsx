import React, { useState } from "react";
import { Button, Space } from "antd";
import DelPopconfirm from "@/components/DelPopconfirm";
import { ConfigurableModalForm, useModalForm } from "@/components/wwModalForm";
import QueryTable from "@/components/wwTableForm";
import type { FormField } from "@/components/wwTableForm";
import dayjs from "dayjs";
import {
  getRoleListAPI,
  createRoleAPI,
  editRoleAPI,
  delectRoleAPI,
} from "@/service/api/roles";
import { useRequest } from "ahooks";

const Index: React.FC = () => {
  /**
   * 创建角色接口
   */
  const createSystemUsersRun = useRequest(createRoleAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      runAsync();
    },
  });
  const editSystemUsersRun = useRequest(editRoleAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      runAsync();
    },
  });
  // 删除角色
  const delectRoleRun = useRequest(delectRoleAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      runAsync();
    },
  });
  /**
   * 查询角色列表
   */
  const { data: userAuthList, runAsync } = useRequest(getRoleListAPI, {
    debounceWait: 100,
  });
  const queryFields: FormField[] = [
    {
      name: "username",
      label: "登录用户",
      type: "input",
    },
    {
      name: "category",
      label: "角色",
      type: "select",
      options: [
        { value: "A", label: "Category A" },
        { value: "B", label: "Category B" },
      ],
    },
    {
      name: "date",
      label: "创建时间",
      type: "datePicker",
    },
  ];
  const fields: any[] = [
    {
      name: "rolename",
      label: "角色名称",
      type: "input",
      formItemProps: {
        rules: [{ required: true, message: "请输入角色名称" }],
      },
    },
    {
      name: "description",
      label: "角色描述",
      type: "input",
    },
  ];

  const { visible, openModal, closeModal, form } = useModalForm();
  const [currentId, setCurrentId] = useState(0);
  const handleOk = (values: Record<string, any>) => {
    !currentId
      ? createSystemUsersRun.run(values)
      : editSystemUsersRun.run({
          ...values,
          roleId: currentId,
        });
    closeModal(); // 关闭弹窗
  };

  return (
    <div>
      <ConfigurableModalForm
        title="用户创建"
        visible={visible}
        onOk={handleOk}
        onCancel={closeModal}
        formFields={fields}
        form={form}
      />
      <QueryTable
        rowKey={"username"}
        columns={[
          {
            dataIndex: "rolename",
            title: "角色名称",
          },
          {
            dataIndex: "description",
            title: "角色描述",
          },
          {
            dataIndex: "createTime",
            title: "创建时间",
            render: (_, { createTime }) => {
              return dayjs(createTime).format("YYYY-MM-DD HH:mm:ss");
            },
          },
          {
            title: "操作",
            key: "action",
            sorter: true,
            render: (record) => (
              <Space size="middle">
                <Button
                  type="link"
                  onClick={() => {
                    openModal("E", record);
                    setCurrentId(record.roleId);
                  }}
                >
                  编辑角色
                </Button>
                <DelPopconfirm
                  onConfirm={() => {
                    delectRoleRun.run({
                      roleId: record?.roleId,
                    });
                  }}
                  disabled={record?.roleId === 1}
                  title={`确定要删除【${record.rolename}】角色的相关信息吗?`}
                />
              </Space>
            ),
          },
        ]}
        formFields={queryFields}
        fetchData={runAsync}
      >
        <Button
          type="primary"
          onClick={() => {
            openModal("A");
            setCurrentId(0);
          }}
        >
          创建角色
        </Button>
      </QueryTable>
    </div>
  );
};

export default Index;

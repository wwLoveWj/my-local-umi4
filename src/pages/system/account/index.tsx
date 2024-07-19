import React, { useState } from "react";
import { Button, Space } from "antd";
import DelPopconfirm from "@/components/DelPopconfirm";
import { ConfigurableModalForm, useModalForm } from "@/components/wwModalForm";
import type { FormField } from "@/components/wwTableForm";
import QueryTable from "@/components/wwTableForm";
import { useRequest } from "ahooks";
import {
  queryUsersAuthListAPI,
  revokeAuthorizationAPI,
  getRoleListAPI,
} from "@/service/api/roles";
import { createSystemUsersAPI, editSystemUsersAPI } from "@/service/api/login";
import { guid } from "@/utils";
import dayjs from "dayjs";
import md5 from "md5";

const Index: React.FC = () => {
  const [currentId, setCurrentId] = useState("");
  /**
   * 查询角色列表
   */
  const { data: roleList } = useRequest(getRoleListAPI, {
    debounceWait: 100,
  });
  /**
   * 创建系统登录用户接口
   */
  const createSystemUsersRun = useRequest(createSystemUsersAPI, {
    debounceWait: 100,
    manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
    onSuccess: () => {
      runAsync();
    },
  });
  const editSystemUsersRun = useRequest(editSystemUsersAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      runAsync();
    },
  });
  /**
   * 查询角色授权列表
   */
  const { data: userAuthList, runAsync } = useRequest(queryUsersAuthListAPI, {
    debounceWait: 100,
  });
  //   解除授权
  const revokeAuthorizationRun = useRequest(revokeAuthorizationAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      runAsync();
    },
  });
  const formQueryFields: FormField[] = [
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
  // 表单配置
  const formModalfields: any[] = [
    {
      name: "username",
      label: "登录用户",
      type: "input",
      formItemProps: {
        rules: [{ required: true, message: "请输入登录用户姓名" }],
      },
    },
    {
      name: "password",
      label: "登录密码",
      type: "input",
      formItemProps: {
        rules: [{ required: true, message: "请输入登录密码" }],
      },
      fieldProps: {
        type: "password",
      },
    },
    {
      name: "roleId",
      label: "选择角色",
      type: "select",
      options: roleList,
      formItemProps: {
        rules: [{ required: true, message: "请选择一个角色" }],
      },
      fieldProps: {
        fieldNames: { label: "rolename", value: "roleId" },
      },
    },
  ];

  const { visible, openModal, closeModal, form } = useModalForm();

  const handleOk = (values: Record<string, any>) => {
    console.log("Received values of form: ", values);
    let params = {
      ...values,
      userId: guid(),
      rolename: roleList.find(
        (item: { roleId: number; rolename: string }) =>
          item.roleId === values.roleId
      )?.rolename,
      password: md5(values?.password),
    };
    !currentId
      ? createSystemUsersRun.run(params)
      : editSystemUsersRun.run({
          userId: currentId,
          password: md5(values?.password),
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
        formFields={formModalfields}
        form={form}
      />
      <QueryTable
        rowKey={"username"}
        columns={[
          {
            dataIndex: "username",
            title: "登录用户",
          },
          {
            dataIndex: "rolename",
            title: "角色",
          },
          {
            dataIndex: "status",
            title: "状态",
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
                    setCurrentId(record.userId);
                  }}
                >
                  修改密码
                </Button>
                <DelPopconfirm
                  disabled={record?.roleId === 1}
                  onConfirm={() => {
                    revokeAuthorizationRun.run({
                      id: record?.id,
                      userId: record?.userId,
                    });
                  }}
                  btnTxt="解除授权"
                  title={`确定要解除【${record.username}】用户的授权信息吗?`}
                />
              </Space>
            ),
          },
        ]}
        formFields={formQueryFields}
        fetchData={runAsync}
        dataSource={userAuthList}
      >
        <Button
          type="primary"
          onClick={() => {
            openModal("A");
            setCurrentId("");
          }}
        >
          创建用户
        </Button>
      </QueryTable>
    </div>
  );
};

export default Index;

import React, { useState } from "react";
import { Space, Button, Table, Form, Input, Select } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import { QueryUserInfoAPI } from "@/service/api/user";
import {
  getRoleListAPI,
  queryUsersAuthListAPI,
  createUserAuthAPI,
  revokeAuthorizationAPI,
} from "@/service/api/roles";
import DelPopconfirm from "@/components/DelPopconfirm";
import { LocalizedModal as WwModel } from "@/components/wwModel/index";
import type { DataType } from "./type.d.ts";

const { TextArea } = Input;
const Index: React.FC = () => {
  const [form] = Form.useForm();
  const [openModel, setOpenModel] = useState(false);
  /**
   * 查询角色授权列表
   */
  const { data: userAuthList, run } = useRequest(queryUsersAuthListAPI, {
    debounceWait: 100,
  });
  /**
   * 查询用户信息
   */
  const { data: userInfoList } = useRequest(QueryUserInfoAPI, {
    debounceWait: 100,
  });
  /**
   * 查询角色信息
   */
  const { data: roleList } = useRequest(getRoleListAPI, {
    debounceWait: 100,
  });
  //   用户授权操作
  const createUserAuthRun = useRequest(
    (params: any) => createUserAuthAPI(params),
    {
      debounceWait: 100,
      manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
      onSuccess: () => {
        setOpenModel(false);
        run();
      },
    }
  );
  //   解除授权
  const revokeAuthorizationRun = useRequest(revokeAuthorizationAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      run();
    },
  });
  // 列表项配置
  const columns: TableColumnsType<DataType> = [
    {
      title: "用户",
      dataIndex: "username",
    },
    {
      title: "角色",
      dataIndex: "rolename",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      render: (_, { createTime }) => {
        return dayjs(createTime).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "备注",
      dataIndex: "description",
    },
    {
      title: "操作",
      key: "action",
      sorter: true,
      render: (record) => (
        <Space size="middle">
          <DelPopconfirm
            onConfirm={() => {
              revokeAuthorizationRun.run({ id: record?.id });
            }}
            btnTxt="解除授权"
            title={`确定要解除【${record.username}】用户的授权信息吗?`}
          />
        </Space>
      ),
    },
  ];
  // 用户信息的select搜索
  const filterUserInfoOption = (
    input: string,
    option?: { username: string; email: string }
  ) => (option?.username ?? "").toLowerCase().includes(input.toLowerCase());
  //   角色信息过滤方法
  const filterRoleInfoOption = (
    input: string,
    option?: { roleName: string; roleId: string }
  ) => (option?.roleName ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <div className="layout-padding-white">
      <div style={{ marginBottom: 16 }}>
        <Space size="small">
          <Button type="primary" onClick={() => setOpenModel(true)}>
            用户授权
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={userAuthList}
        rowKey="id"
        size="small"
      />
      {/* --------------------------------申请授权弹窗----------------------- */}
      {openModel && (
        <WwModel
          title="用户授权"
          isOpenModel={openModel}
          hideModal={() => setOpenModel(false)}
          submitModal={() =>
            form.validateFields().then((res) => {
              const username = userInfoList.find(
                (item: any) => item.userId === res?.userId
              )?.username;
              const rolename = roleList.find(
                (item: any) => item.roleId === res?.roleId
              )?.roleName;
              let params = {
                ...res,
                rolename,
                username,
              };
              createUserAuthRun.run(params);
            })
          }
        >
          <Form layout="vertical" form={form} initialValues={{}}>
            <Form.Item
              name="userId"
              label="用户"
              rules={[{ required: true, message: "请选择用户" }]}
            >
              <Select
                // mode="multiple"
                allowClear
                placeholder="请选择用户"
                options={userInfoList}
                filterOption={filterUserInfoOption}
                fieldNames={{ label: "username", value: "userId" }}
              />
            </Form.Item>
            <Form.Item
              name="roleId"
              label="角色"
              rules={[{ required: true, message: "请选择对应的角色" }]}
            >
              <Select
                // mode="multiple"
                allowClear
                placeholder="请选择对应的角色"
                options={roleList}
                filterOption={filterRoleInfoOption}
                fieldNames={{ label: "roleName", value: "roleId" }}
              />
            </Form.Item>
            <Form.Item name="description" label="备注">
              <TextArea showCount maxLength={100} placeholder="其它" />
            </Form.Item>
          </Form>
        </WwModel>
      )}
    </div>
  );
};

export default Index;

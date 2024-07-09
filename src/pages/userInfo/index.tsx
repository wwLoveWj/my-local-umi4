import React, { useEffect, useState } from "react";
import { Space, Button, Table, Tag, Popconfirm } from "antd";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import {
  UserInfoCreate,
  UserInfoUpdate,
  UserInfoDel,
  QueryUserInfoAPI,
} from "@/service/api/user";
import DelPopconfirm from "@/components/DelPopconfirm";
import UserInfoDrawer from "./UserInfoDrawer";
import type { DataType } from "./type.d.ts";

const statusMap = new Map([
  ["0", "差"],
  ["1", "良好"],
  ["2", "优秀"],
]);
const Index: React.FC = () => {
  const [editData, setEditData] = useState<Partial<DataType>>({}); //获取编辑的数据
  const [open, setOpen] = useState(false); //新增编辑弹窗的打开关闭
  const [action, setAction] = useState("A"); //新增编辑操作 "E"为编辑，"A"为新增
  const [tableData, setTableData] = useState<DataType[]>([]); //用户信息表格

  // 列表项配置
  const columns: TableColumnsType<DataType> = [
    {
      title: "姓名",
      dataIndex: "username",
    },
    {
      title: "年龄",
      dataIndex: "age",
    },
    {
      title: "体重",
      dataIndex: "weight",
    },
    {
      title: "分数",
      dataIndex: "score",
      render: (_, { score }) => {
        let color = Number(score) > 80 ? "green" : "yellow";
        if (Number(score) < 60) {
          color = "red";
        }
        return <Tag color={color}>{Math.floor(score)}</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (_, { score }) => {
        let status = Number(score) > 80 ? "2" : Number(score) < 60 ? "0" : "1";
        let color =
          status === "2" ? "green" : status === "1" ? "yellow" : "red";
        return <Tag color={color}>{statusMap.get(status)}</Tag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      render: (_, { createTime }) => {
        return dayjs(createTime).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: "Action",
      key: "action",
      sorter: true,
      render: (record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setEditData(record);
              setAction("E");
              setOpen(true);
            }}
          >
            编辑
          </a>
          <DelPopconfirm
            onConfirm={() => {
              UserInfoDelRun.run({ userId: record?.userId });
            }}
            title={`确定要删除【${record.username}】的用户信息吗?`}
          />
          {/* <a
            onClick={() => {
              history.push(
                {
                  pathname: "/user-integral/integral-details",
                },
                { ...record }
              );
            }}
          >
            详情
          </a> */}
        </Space>
      ),
    },
  ];

  const getUserInfo = async () => {
    let result = await QueryUserInfoAPI();
    setTableData(result);
  };
  //第一个参数service是异步函数
  const UserInfoCreateRun = useRequest(
    (params: any) => UserInfoCreate(params),
    {
      debounceWait: 100,
      manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
      onSuccess: () => {
        setOpen(false);
        getUserInfo();
      },
    }
  );
  const UserInfoUpdateRun = useRequest(
    (params: any) => UserInfoUpdate(params),
    {
      debounceWait: 100,
      manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
      onSuccess: () => {
        setOpen(false);
        getUserInfo();
      },
    }
  );
  const UserInfoDelRun = useRequest((params: any) => UserInfoDel(params), {
    debounceWait: 100,
    manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
    onSuccess: () => {
      getUserInfo();
    },
  });
  // ------------------------------------------------------
  // 以下是创建扣分项目的操作
  const submitDrawer = (res: any) => {
    if (action === "A") {
      UserInfoCreateRun.runAsync(res);
    } else {
      UserInfoUpdateRun.runAsync(res);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  /**
   * 扣分操作
   */
  const createUser = () => {
    setAction("A");
    setEditData({});
    setOpen(true);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Space size="small">
          <Button type="primary" onClick={createUser}>
            创建用户
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="userId"
        size="small"
      />
      {open && (
        <UserInfoDrawer
          open={open}
          action={action}
          submitDrawer={submitDrawer}
          onClose={onClose}
          editData={editData}
        />
      )}
    </>
  );
};

export default Index;

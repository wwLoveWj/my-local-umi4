import React, { useEffect, useState } from "react";
import { Space, Button, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { history } from "umi";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import {
  ScoreInfoCreateAPI,
  ScoreInfoEditAPI,
  ScoreInfoDeleteAPI,
  ScoreInfoAPI,
} from "@/service/api/score";
import DeductionScoreDrawer from "./DeductionScoreDrawer";
import DelPopconfirm from "@/components/DelPopconfirm";
import type { DataType } from "./type.d.ts";

const statusMap = new Map([
  ["0", "差"],
  ["1", "良好"],
  ["2", "优秀"],
]);
const Index: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editData, setEditData] = useState<Partial<DataType>>({}); //获取编辑的数据
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("A"); //新增编辑操作 "E"为编辑，"A"为新增
  const [tableData, setTableData] = useState<DataType[]>([]);

  // 列表项配置
  const columns: TableColumnsType<DataType> = [
    {
      title: "姓名",
      dataIndex: "username",
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
      title: "更新时间",
      dataIndex: "updateTime",
      render: (_, { updateTime }) => {
        return dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss");
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
              ScoreInfoDeleteAPIRun.run({ scoreId: record?.scoreId });
            }}
            title={`确定要删除【${record.username}】的分数信息吗?`}
          />
          <a
            onClick={() => {
              history.push(
                {
                  pathname: "/user-integral/integral-details",
                },
                { ...record }
              );
            }}
          >
            扣分细则
          </a>
        </Space>
      ),
    },
  ];
  // 批量操作处理
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  /**
   * 以下是多选框的操作处理
   * @param newSelectedRowKeys 勾选的数据项
   */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  // ------------------------------------------------------
  /**
   * 获取扣分系统列表
   */
  const getScoreInfoAPI = async () => {
    let result = await ScoreInfoAPI();
    setTableData(result);
  };
  /**
   * 新增扣分信息接口
   */
  const ScoreInfoCreateAPIRun = useRequest(
    (params: any) => ScoreInfoCreateAPI(params),
    {
      debounceWait: 100,
      manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
      onSuccess: () => {
        setOpen(false);
        getScoreInfoAPI();
      },
    }
  );
  const ScoreInfoEditAPIRun = useRequest(
    (params: any) => ScoreInfoEditAPI(params),
    {
      debounceWait: 100,
      manual: true, //若设置了这个参数,则不会默认触发,需要通过run触发
      onSuccess: () => {
        setOpen(false);
        getScoreInfoAPI();
      },
    }
  );
  const ScoreInfoDeleteAPIRun = useRequest(
    (params: any) => ScoreInfoDeleteAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        getScoreInfoAPI();
      },
    }
  );

  // 以下是创建扣分项目的操作
  const submitDrawer = (res: any) => {
    if (action === "A") {
      ScoreInfoCreateAPIRun.run(res);
    } else {
      ScoreInfoEditAPIRun.run(res);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  /**
   * 扣分操作
   */
  const deductionScore = () => {
    setAction("A");
    setEditData({});
    setOpen(true);
  };

  useEffect(() => {
    getScoreInfoAPI();
  }, []);
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Space size="small">
          <Button
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            批量操作
          </Button>
          <Button type="primary" onClick={deductionScore}>
            扣分
          </Button>
        </Space>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        rowKey="userId"
        size="small"
      />
      {open && (
        <DeductionScoreDrawer
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

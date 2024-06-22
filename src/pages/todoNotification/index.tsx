import React, { useState, useRef } from "react";
import { Card, Button, Flex, Row, Col, Input } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { AlertOutlined, AudioOutlined } from "@ant-design/icons";
import {
  QueryTaskInfoAPI,
  reminderTaskAPI,
  createReminderTaskAPI,
} from "@/service/api/task";
import ReminderTimeModal from "./components/ReminderTimeModal";
import { useRequest } from "ahooks";
import styles from "./style.less";
import { guid } from "@/utils";
import dayjs from "dayjs";

const STATUS_TYPE = new Map([
  ["1", "completed"],
  ["0", "pendding"],
]);
const { Search } = Input;
const Index = () => {
  const [taskList, setTaskList] = useState<API.taskListType[]>([]);
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);

  // 请求任务卡片列表信息
  const queryQueryTaskInfo = useRequest(() => QueryTaskInfoAPI({}), {
    debounceWait: 100,
    onSuccess: (res: API.taskListType[]) => {
      setTaskList(res);
    },
  });
  // 任务定时提醒接口
  const reminderTaskFn = useRequest(
    (params: {
      userEmail: string;
      reminderContent: string;
      reminderTime: string;
      taskId: string;
    }) => reminderTaskAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        queryQueryTaskInfo.run();
      },
    }
  );
  //   创建任务信息卡片
  const createReminderTask = useRequest(
    (task: string) =>
      createReminderTaskAPI({ task, taskId: guid(), status: 0 }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        queryQueryTaskInfo.run();
      },
    }
  );
  const getReminderTime = (param: any, item: any) => {
    setIsOpenModel(false);
    const { userEmail, reminderTime } = param;
    reminderTaskFn.run({
      userEmail,
      reminderContent: item.task,
      reminderTime,
      taskId: item.taskId,
    });
  };
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );
  //   创建任务
  const onSearch: SearchProps["onSearch"] = (value) => {
    createReminderTask.run(value);
  };
  return (
    <>
      <Search
        style={{ marginBottom: "12px" }}
        placeholder="创建任务提醒"
        enterButton="Add"
        size="large"
        suffix={suffix}
        onSearch={onSearch}
      />
      <Row gutter={[16, 12]}>
        {taskList.map((item) => {
          return (
            <Col span={8} key={item.taskId}>
              <Card
                className={styles.animateCard}
                bodyStyle={{ padding: "18px 20px" }}
              >
                <Flex wrap gap="small" vertical>
                  <div className={styles.taskHeader}>
                    <div>
                      <div className={styles.task}>
                        <h3 style={{ color: "#0080f6" }}>Task：</h3>
                        <h3>{item.task}</h3>
                      </div>
                      <p
                        style={{
                          color:
                            STATUS_TYPE.get(item.status) === "completed"
                              ? "#44b06c"
                              : "#ffc045",
                        }}
                      >
                        状态：{STATUS_TYPE.get(item.status)}
                      </p>
                    </div>
                    <div
                      className={styles.reminderTime}
                      onClick={() => {
                        // 调出时间设置弹窗
                        setIsOpenModel(true);
                      }}
                    >
                      <AlertOutlined />
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#8a8a8a",
                          marginTop: "8px",
                        }}
                      >
                        设置提醒
                      </span>
                    </div>
                  </div>
                  <div className={styles.times}>
                    <p style={{ color: "#92999f" }}>
                      创建时间：
                      {dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                    {item.completeTime && <p>完成时间：{item.completeTime}</p>}
                  </div>
                  <div className="btn">
                    <Button type="primary" danger>
                      删除
                    </Button>
                  </div>
                </Flex>
                <ReminderTimeModal
                  setIsOpenModel={setIsOpenModel}
                  isOpenModel={isOpenModel}
                  taskDetails={item}
                  getReminderTime={getReminderTime}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default Index;

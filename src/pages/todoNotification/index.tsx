import React, { useRef, useState } from "react";
import { Card, Button, Flex, Row, Col, Input, Popconfirm, Form } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { AlertOutlined, AudioOutlined } from "@ant-design/icons";
import {
  QueryTaskInfoAPI,
  reminderTaskAPI,
  createReminderTaskAPI,
  deleteReminderTaskAPI,
  reminderTimeTaskAPI,
} from "@/service/api/task";
import ReminderTimeModal from "./components/ReminderTimeModal";
import { useRequest } from "ahooks";
import styles from "./style.less";
import { guid, countDown } from "@/utils";
import dayjs from "dayjs";
import "./style.less";

const STATUS_TYPE = new Map([
  ["1", "completed"],
  ["0", "pendding"],
  ["2", "todoing"],
]);
// TODO:表单填写的校验和封装-------------------倒计时相关优化
const { Search } = Input;
const Index = () => {
  const [form] = Form.useForm();
  const [taskList, setTaskList] = useState<API.taskListType[]>([]);
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState<
    Partial<{
      task: string;
      taskId: string;
    }>
  >({});
  const timeRef = useRef(null);
  // 请求任务卡片列表信息
  const queryQueryTaskInfo = useRequest(() => QueryTaskInfoAPI({}), {
    debounceWait: 100,
    onSuccess: (res: API.taskListType[]) => {
      setTaskList(res);
    },
  });
  // 创建定时任务队列
  const reminderTimeTaskFn = useRequest(
    (params: {
      userEmail: string;
      reminderContent: string;
      reminderTime: string;
      taskId: string;
    }) => reminderTimeTaskAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        queryQueryTaskInfo.run();
        // 语音提示用户任务
        // const utterThis = new window.SpeechSynthesisUtterance(taskDetails.task);
        // window.speechSynthesis.speak(utterThis);
      },
    }
  );
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
      onSuccess: (res) => {
        if (res) {
          reminderTimeTaskFn.run(res.data);
        }
        queryQueryTaskInfo.run();
      },
    }
  );
  //   创建任务信息卡片
  const createReminderTask = useRequest(
    (task: string) =>
      createReminderTaskAPI({ task, taskId: guid(), status: 2 }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        setTaskName("");
        form.resetFields();
        queryQueryTaskInfo.run();
      },
    }
  );
  const deleteReminderTask = useRequest(
    (taskId: string) => deleteReminderTaskAPI({ taskId }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        queryQueryTaskInfo.run();
      },
    }
  );
  //   发送任务提醒
  const getReminderTime = (param: any) => {
    setIsOpenModel(false);
    const { userEmail, reminderTime } = param;
    reminderTaskFn.run({
      userEmail,
      reminderContent: taskDetails.task,
      reminderTime,
      taskId: taskDetails.taskId,
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
    form.validateFields().then(() => {
      createReminderTask.run(value);
    });
  };

  return (
    <div className={styles.taskInfo}>
      <div className={styles.completedTotal}>
        <span>{`已完成：${
          taskList.filter((item) => Number(item.status) === 1)?.length
        }条`}</span>
        <span>{`未完成：${
          taskList.filter((item) => Number(item.status) !== 1)?.length
        }条`}</span>
      </div>
      <Form
        name="basic"
        form={form}
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          name="task"
          rules={[{ required: true, message: "请输入您想创建的任务..." }]}
        >
          <Search
            placeholder="创建任务提醒"
            enterButton="Add"
            size="large"
            className={styles.createTask}
            suffix={suffix}
            value={taskName}
            onSearch={onSearch}
            onChange={(e) => {
              let value = e.target.value;
              setTaskName(value);
            }}
          />
        </Form.Item>
      </Form>
      <Row
        gutter={[16, 12]}
        style={{ padding: "0 12px 12px", width: `calc(100% + 8px)` }}
      >
        {taskList.map((item) => {
          return (
            <Col span={8} key={item.taskId}>
              <Card
                className={styles.animateCard}
                bodyStyle={{ padding: "18px 20px" }}
                loading={queryQueryTaskInfo.loading}
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
                              : Number(item.status) === 0
                              ? "#ffc045"
                              : "yellow",
                        }}
                      >
                        状态：{STATUS_TYPE.get(item.status)}
                      </p>
                    </div>
                    <div
                      ref={timeRef}
                      className={styles.reminderTime}
                      style={
                        item.reminderTime && Number(item.status) === 0
                          ? { animation: `colorChg 1.5s infinite` }
                          : {}
                      }
                      onClick={() => {
                        // 调出时间设置弹窗
                        setTaskDetails(item);
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
                    {item.reminderTime && <p>提醒时间：{item.reminderTime}</p>}
                  </div>
                  <div className={styles.delBtn}>
                    <Popconfirm
                      title={`确定要删除【${item.task}】任务吗？`}
                      placement="topLeft"
                      onConfirm={() => {
                        deleteReminderTask.run(item.taskId);
                      }}
                    >
                      <Button type="primary" danger>
                        删除
                      </Button>
                    </Popconfirm>
                    <div className={styles.countDown}>
                      {item.reminderTime &&
                        Number(item.status) === 0 &&
                        `倒计时：`}
                      {item.reminderTime && Number(item.status) === 0 && (
                        <p id={`${item.taskId}`}>
                          {countDown(
                            item.taskId,
                            item.reminderTime,
                            Number(item.status)
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </Flex>
              </Card>
            </Col>
          );
        })}
      </Row>
      <ReminderTimeModal
        setIsOpenModel={setIsOpenModel}
        isOpenModel={isOpenModel}
        getReminderTime={getReminderTime}
      />
    </div>
  );
};

export default Index;

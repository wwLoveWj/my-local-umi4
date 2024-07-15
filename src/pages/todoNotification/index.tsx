import React, { useRef, useState } from "react";
import {
  Card,
  Button,
  Flex,
  Row,
  Col,
  Input,
  Popconfirm,
  Form,
  Checkbox,
  Alert,
  Empty,
  Switch,
  DatePicker,
  Select,
} from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { AlertOutlined, AudioOutlined } from "@ant-design/icons";
import {
  QueryTaskInfoAPI,
  reminderTaskAPI,
  createReminderTaskAPI,
  deleteReminderTaskAPI,
  reminderTimeTaskAPI,
  batchDelTaskListAPI,
} from "@/service/api/task";
import ReminderTimeModal from "./components/ReminderTimeModal";
import { useRequest } from "ahooks";
import styles from "./style.less";
import { guid, countDown, disabledDate, disabledRangeTime } from "@/utils";
import dayjs from "dayjs";
import "./style.less";

const IntervalUnit = new Map([
  ["second", "秒"],
  ["minute", "分钟"],
  ["hour", "小时"],
  ["day", "日"],
  ["week", "周"],
  ["month", "月"],
  ["year", "年"],
]);
const STATUS_TYPE = new Map([
  ["1", "completed"],
  ["0", "pendding"],
  ["2", "todoing"],
]);
const { RangePicker } = DatePicker;
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
  const [taskIdList, setTaskIdList] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [isShowDelBtn, setIsShowDelBtn] = useState(true);
  const timeRef = useRef(null);
  // 请求任务卡片列表信息
  const queryQueryTaskInfo = useRequest(QueryTaskInfoAPI, {
    debounceWait: 100,
    onSuccess: (res: API.taskListType[]) => {
      for (let i = 0; i < res.length; i++) {
        res[i].checked = false;
      }
      setTaskList([...res]);
    },
  });
  // 创建定时任务队列
  const reminderTimeTaskFn = useRequest(
    (params: {
      userEmail: string;
      reminderContent: string;
      reminderTime: string;
      taskId: string;
      reminderPattern: string;
      interval: string;
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
      reminderPattern: string;
      interval: string;
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
  // 批量删除任务
  const batchDelTaskListFn = useRequest(batchDelTaskListAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: () => {
      setAllChecked(false);
      setTaskIdList([]);
      queryQueryTaskInfo.run();
    },
  });
  //   发送任务提醒
  const getReminderTime = (param: any) => {
    setIsOpenModel(false);
    const { userEmail, reminderTime, reminderPattern, interval } = param;
    reminderTaskFn.run({
      userEmail,
      reminderContent: taskDetails.task,
      reminderTime,
      taskId: taskDetails.taskId,
      reminderPattern,
      interval,
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

  // 单选checkbox
  const selectedTask = (index: number) => {
    let tmpUsers = [...taskList];
    tmpUsers[index].checked = !tmpUsers[index].checked;
    const arr = [...taskIdList];
    if (tmpUsers[index].checked) {
      arr.push(tmpUsers[index].taskId);
    } else {
      const i = arr.findIndex((taskId) => taskId === tmpUsers[index].taskId);
      arr.splice(i, 1);
    }
    setTaskIdList([...arr]);
    setTaskList([...tmpUsers]);
  };
  // 全选卡片checkbox
  const selectAllTasks = () => {
    setAllChecked(!allChecked);
    let tmpUsers = [...taskList];
    for (let i = 0; i < tmpUsers.length; i++) {
      tmpUsers[i].checked = !allChecked;
    }
    let arr: string[] = [];
    tmpUsers.map((item) => {
      if (item.checked) {
        arr.push(item.taskId);
      } else {
        const index = arr.findIndex((taskId) => taskId === item.taskId);
        arr.splice(index, 1);
      }
    });
    setTaskIdList([...arr]);
    setTaskList([...tmpUsers]);
  };
  // 开启关闭批量删除的按钮开关
  const onChangeSwitch = (checked: boolean) => {
    setIsShowDelBtn(checked);
  };

  const onChangeStatus = (value: string) => {
    queryQueryTaskInfo.run({ taskStatus: value });
  };
  // 查询任务
  const onSearchTask: SearchProps["onSearch"] = (value) => {
    queryQueryTaskInfo.run({ taskName: value });
  };

  return (
    <div className={styles.taskInfo}>
      <Row style={{ padding: "12px 12px 0" }} gutter={[16, 12]}>
        <Col span={8}>
          <Search
            placeholder="请输入你想查询的任务名称..."
            enterButton
            value={taskName}
            onSearch={onSearchTask}
            onChange={(e) => {
              let value = e.target.value;
              setTaskName(value);
            }}
            allowClear
          />
        </Col>
        {/* TODO:查询有点问题不知道咋写 */}
        <Col span={8}>
          <RangePicker
            disabledDate={disabledDate}
            disabledTime={disabledRangeTime}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [
                dayjs("00:00:00", "HH:mm:ss"),
                dayjs("11:59:59", "HH:mm:ss"),
              ],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Col>
        <Col span={8}>
          <Select
            showSearch
            placeholder="请选择任务状态"
            optionFilterProp="children"
            onChange={onChangeStatus}
            defaultValue={"2"}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%" }}
            options={[
              {
                value: "0",
                label: "pendding",
              },
              {
                value: "1",
                label: "completed",
              },
              {
                value: "2",
                label: "todoing",
              },
            ]}
          />
        </Col>
      </Row>
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
        autoComplete="off"
        className={styles.searchForm}
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
            onSearch={onSearch}
          />
        </Form.Item>
      </Form>
      {taskList?.length > 0 && (
        <div
          style={{
            display: "flex",
            margin: "24px 12px 12px",
            justifyContent: "flex-end",
          }}
        >
          {isShowDelBtn && (
            <div className={styles.allSelected} style={{ flex: 4 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox checked={allChecked} onChange={selectAllTasks}>
                  全选
                </Checkbox>
                <Alert
                  message={`当前选中任务数：${taskIdList.length}项`}
                  type="info"
                  showIcon
                  banner={true}
                  style={{ width: "200px", color: "#1677ff" }}
                />
              </div>
              <Button
                danger
                type="primary"
                disabled={taskIdList.length === 0}
                onClick={() => batchDelTaskListFn.run({ taskIdList })}
              >
                批量删除
              </Button>
            </div>
          )}
          <div
            style={{
              justifyContent: "flex-end",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked
              onChange={onChangeSwitch}
            />
          </div>
        </div>
      )}
      {taskList?.length > 0 ? (
        <Row
          gutter={[16, 12]}
          style={{ padding: "0 12px 12px", width: `calc(100% + 8px)` }}
        >
          {taskList.map((item, index) => {
            return (
              <Col
                span={8}
                key={item.taskId}
                onClick={() => selectedTask(index)}
              >
                <Card
                  className={styles.animateCard}
                  bodyStyle={{
                    padding: "18px 20px",
                    background: item.checked ? "orange" : "#f8f9fa",
                  }}
                  loading={queryQueryTaskInfo.loading}
                >
                  {/* <Checkbox
                  checked={item.checked}
                  onChange={() => selectedTask(index)}
                /> */}
                  <Flex wrap gap="small" vertical>
                    <div className={styles.taskHeader}>
                      <div>
                        <div className={styles.task}>
                          <h3 style={{ color: "#0080f6" }}>Task：</h3>
                          <h3 style={{ color: item.checked ? "#fff" : "#000" }}>
                            {item.task}
                          </h3>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          // 调出时间设置弹窗
                          setTaskDetails(item);
                          setIsOpenModel(true);
                        }}
                      >
                        <AlertOutlined />
                        <span
                          style={{
                            fontSize: "12px",
                            color: item.checked ? "#fff" : "#8a8a8a",
                            marginTop: "8px",
                          }}
                        >
                          设置提醒
                        </span>
                      </div>
                    </div>
                    <div className={styles.times}>
                      <p style={{ color: item.checked ? "#fff" : "#92999f" }}>
                        创建时间：
                        {dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}
                      </p>
                      {item.reminderTime &&
                        item.reminderPattern !== "intervalTime" && (
                          <p style={{ color: item.checked ? "#fff" : "#000" }}>
                            提醒时间：
                            {dayjs(item.reminderTime).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </p>
                        )}
                      {item.reminderTime &&
                        item.reminderPattern === "intervalTime" && (
                          <p>
                            提醒间隔：
                            <span style={{ color: "green" }}>
                              {item.reminderTime}{" "}
                              {IntervalUnit.get(item.intervalUnit)}
                            </span>
                          </p>
                        )}
                    </div>
                    <div className={styles.delBtn}>
                      <span onClick={(e) => e.stopPropagation()}>
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
                      </span>
                      {item.reminderTime &&
                        Number(item.status) === 0 &&
                        item.reminderPattern !== "intervalTime" && (
                          <div className={styles.countDown}>
                            倒计时：
                            <p id={`${item.taskId}`}>
                              {countDown(
                                item.taskId,
                                item.reminderTime,
                                Number(item.status)
                              )}
                            </p>
                          </div>
                        )}
                    </div>
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className={styles.emptyCard}>
          <Empty description={false} />
        </div>
      )}
      <ReminderTimeModal
        setIsOpenModel={setIsOpenModel}
        isOpenModel={isOpenModel}
        getReminderTime={getReminderTime}
      />
    </div>
  );
};

export default Index;

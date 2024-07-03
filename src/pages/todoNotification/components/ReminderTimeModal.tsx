import React, { useState } from "react";
import { LocalizedModal as WwModel } from "@/components/wwModel/index";
import type { DatePickerProps } from "antd";
import { DatePicker, Form, Button, Select } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { useRequest } from "ahooks";
import { QueryUserInfoAPI } from "@/service/api/user";
import dayjs from "dayjs";
const Index = ({
  isOpenModel,
  setIsOpenModel,
  getReminderTime,
}: {
  isOpenModel: boolean;
  setIsOpenModel: any;
  getReminderTime: (param: any) => void;
}) => {
  const [form] = Form.useForm();
  const [reminderTime, setReminderTime] = useState<string | string[]>("");
  const hideModal = () => {
    setIsOpenModel(false);
  };

  /**
   * 查询用户信息接口
   */
  const { data: userEmailList } = useRequest(QueryUserInfoAPI, {
    debounceWait: 100,
  });
  const filterOption = (
    input: string,
    option?: { username: string; email: string }
  ) => (option?.username ?? "").toLowerCase().includes(input.toLowerCase());
  const onOk = (value: DatePickerProps["value"]) => {
    console.log("onOk: ", value);
  };
  const onFinish = () => {
    form.validateFields().then((res) => {
      getReminderTime({ reminderTime, userEmail: res.userEmail });
      form.resetFields();
    });
  };
  // 日期选择器时间的禁用
  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  //当日只能选择当前时间之后的时间点
  const disabledTime = (date: any) => {
    const currentDay = dayjs().date(); //当下的时间
    const currentHours = dayjs().hour();
    const currentMinutes = dayjs().minute(); //设置的时间
    const currentSeconds = dayjs().second(); //设置的时间
    const settingHours = dayjs(date).hour();
    const settingDay = dayjs(date).date();

    if (date && settingDay === currentDay && settingHours === currentHours) {
      // 这里需要分几种情况去禁用秒针
      return {
        disabledHours: () => range(0, currentHours), //设置为当天现在这小时，禁用该小时，该分钟之前的时间
        disabledMinutes: () => range(0, currentMinutes),
        // disabledSeconds: () => range(0, currentSeconds),
      };
    } else if (
      date &&
      settingDay === currentDay &&
      settingHours > currentHours
    ) {
      return {
        disabledHours: () => range(0, currentHours), //设置为当天现在这小时之后，只禁用当天该小时之前的时间
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
    } else if (
      date &&
      settingDay === currentDay &&
      settingHours < currentHours
    ) {
      return {
        disabledHours: () => range(0, currentHours), //若先设置了的小时小于当前的，再设置日期为当天，需要禁用当天现在这小时之前的时间和所有的分
        disabledMinutes: () => range(0, 59),
        disabledSeconds: () => range(0, 59),
      };
    } else {
      return {
        disabledHours: () => [], //设置为当天之后的日期，则不应有任何时间分钟的限制
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
    }
  };

  return (
    <>
      {isOpenModel && (
        <WwModel
          title="提醒时间"
          isOpenModel={isOpenModel}
          hideModal={hideModal}
          footer={
            <div>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "12px" }}
                onClick={onFinish}
              >
                确定
              </Button>
              <Button onClick={hideModal}>取消</Button>
            </div>
          }
        >
          <Form
            name="modal"
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="提醒时间"
              name="reminderTime"
              rules={[{ required: true, message: "请选择您需要提醒的时间！" }]}
            >
              <DatePicker
                showTime
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                onChange={(_, dateString) => {
                  setReminderTime(dateString);
                }}
                onOk={onOk}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              label="提醒邮箱"
              name="userEmail"
              rules={[{ required: true, message: "请选择您的提醒人邮箱..." }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="请选择您的提醒人邮箱"
                options={userEmailList}
                filterOption={filterOption}
                fieldNames={{ label: "username", value: "email" }}
              />
            </Form.Item>
          </Form>
        </WwModel>
      )}
    </>
  );
};

export default Index;

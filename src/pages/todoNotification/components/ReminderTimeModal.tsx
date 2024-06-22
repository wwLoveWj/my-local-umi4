import React, { useState, useEffect } from "react";
import { LocalizedModal as WwModel } from "@/components/wwModel/index";
import type { DatePickerProps } from "antd";
import { DatePicker, Input } from "antd";

const Index = ({
  isOpenModel,
  setIsOpenModel,
  getReminderTime,
  taskDetails,
}: {
  isOpenModel: boolean;
  setIsOpenModel: any;
  getReminderTime: (param: any, details: any) => void;
  taskDetails: any;
}) => {
  const [reminderTime, setReminderTime] = useState<string | string[]>("");
  const [userEmail, setUserEmail] = useState("");
  const hideModal = () => {
    setIsOpenModel(false);
  };

  const onOk = (value: DatePickerProps["value"]) => {
    console.log("onOk: ", value);
  };
  const submitReminderTime = () => {
    getReminderTime({ reminderTime, userEmail }, taskDetails);
  };

  return (
    <>
      {isOpenModel && (
        <WwModel
          title="提醒时间"
          isOpenModel={isOpenModel}
          hideModal={hideModal}
          submitModal={submitReminderTime}
        >
          <DatePicker
            showTime
            onChange={(_, dateString) => {
              setReminderTime(dateString);
            }}
            onOk={onOk}
          />
          <Input
            suffix="@163.com"
            defaultValue="blww885"
            onChange={(e) => {
              let value = e.target.value;
              setUserEmail(value + "@163.com");
            }}
          />
        </WwModel>
      )}
    </>
  );
};

export default Index;

import React, { useImperativeHandle, forwardRef } from "react";
import { Button, Form, Input, Select, Space } from "antd";
import { useRequest } from "ahooks";
import { MailInfoSettingsAPI } from "@/service/api/mails";

const hostList = [
  { value: "smtp.163.com", label: "163邮箱" },
  { value: "smtp.qq.com", label: "qq邮箱" },
];
const Index = forwardRef(({}, preantRef) => {
  const [form] = Form.useForm();
  const filterOption = (
    input: string,
    option?: { value: string; label: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const MailInfoSettings = useRequest(
    (params: API.MailSendParamsType) => MailInfoSettingsAPI(params),
    {
      debounceWait: 100,
      manual: true,
    }
  );
  useImperativeHandle(preantRef, () => {
    return {
      onFinish: () => {
        return form.validateFields().then(async () => {
          const { user, pass, host } = form.getFieldsValue();
          await MailInfoSettings.runAsync({
            user,
            pass,
            host,
            current: JSON.parse(localStorage.getItem("login-info") || `{}`)
              ?.username,
          });
        });
      },
    };
  });
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="host"
        label="host"
        rules={[{ required: true, message: "请选择host" }]}
      >
        <Select
          placeholder="请选择host"
          options={hostList}
          filterOption={filterOption}
        />
      </Form.Item>
      <Form.Item
        name="user"
        label="邮箱"
        rules={[{ required: true, message: "请输入邮件" }]}
      >
        <Input placeholder="请输入邮件" />
      </Form.Item>
      <Form.Item
        name="pass"
        label="授权码"
        rules={[{ required: true, message: "请输入授权码" }]}
      >
        <Input placeholder="请输入授权码" />
      </Form.Item>
    </Form>
  );
});

export default Index;

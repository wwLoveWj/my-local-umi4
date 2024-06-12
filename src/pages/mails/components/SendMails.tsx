import React, { useState } from "react";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { useRequest } from "ahooks";
import { MailInfoSendAPI } from "@/service/api/mails";
import { UserInfo } from "@/service/api/user";
import UploadImage from "@/pages/files/components/Upload";
const { TextArea } = Input;

const Index = () => {
  const [receiverList, setReceiverList] = useState([]);
  const [form] = Form.useForm();
  const filterOption = (
    input: string,
    option?: { username: string; email: string }
  ) => (option?.username ?? "").toLowerCase().includes(input.toLowerCase());
  /**
   * 查询用户信息接口
   */
  useRequest(() => UserInfo(), {
    debounceWait: 100,
    onSuccess: (res: any) => {
      setReceiverList(res);
    },
  });

  return (
    <Form
      labelAlign="right"
      labelCol={{ span: 3 }}
      form={form}
      onFinish={(value) => {
        const { receiver, content, title, attachments } = value;
        MailInfoSendAPI({
          to: receiver,
          subject: title,
          text: content,
          attachments,
        });
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="主题"
            rules={[{ required: true, message: "请输入邮件主题名" }]}
          >
            <Input placeholder="请输入邮件主题名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="receiver"
            label="收件人"
            rules={[{ required: true, message: "请选择收件人" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="请选择收件人"
              options={receiverList}
              filterOption={filterOption}
              fieldNames={{ label: "username", value: "email" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="content" label="正文">
            <TextArea
              showCount
              maxLength={100}
              placeholder="请输入你想说的话"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="attachments" label="附件">
            <UploadImage
              getImgUrl={({
                data,
              }: {
                data: { filename: string; path: string };
              }) => {
                // 获取到上传图片后得到的响应信息
                let param = {
                  filename: data?.filename,
                  path: data?.path,
                };
                form.setFieldValue("attachments", param);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Space>
        <Button htmlType="submit" type="primary">
          Send
        </Button>
      </Space>
    </Form>
  );
};

export default Index;

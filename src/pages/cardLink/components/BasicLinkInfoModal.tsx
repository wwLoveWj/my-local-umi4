import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, Select } from "antd";
// import { useRequest } from "ahooks";
import UploadImage from "@/pages/files/index";
import { guid } from "@/utils";
const { TextArea } = Input;

const Index = forwardRef(({}, preantRef) => {
  const [form] = Form.useForm();
  // TODO:还要写一个分类的下拉框
  // const filterOption = (
  //   input: string,
  //   option?: { username: string; email: string }
  // ) => (option?.username ?? "").toLowerCase().includes(input.toLowerCase());

  useImperativeHandle(preantRef, () => {
    return {
      onFinish: () => {
        return form.validateFields().then(async (values) => {
          let params = { linkId: guid(), ...values };
          return params;
        });
      },
    };
  });
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="link"
        label="网址"
        rules={[{ required: true, message: "请输入网址" }]}
      >
        <Input placeholder="请输入网址" />
      </Form.Item>
      <Form.Item
        name="name"
        label="网址名"
        rules={[{ required: true, message: "请输入网址名" }]}
      >
        <Input placeholder="请输入网址名" />
      </Form.Item>
      <Form.Item name="description" label="描述">
        <TextArea showCount maxLength={100} placeholder="请输入描述" />
      </Form.Item>
      <Form.Item name="avatar" label="头像">
        <UploadImage
          getImgUrl={({ data }: { data: { url: string } }) => {
            // 获取到上传图片后得到的响应信息
            form.setFieldValue("avatar", data.url);
          }}
        />
      </Form.Item>
    </Form>
  );
});

export default Index;

import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  InputNumber,
} from "antd";
import { guid } from "@/utils";
import type { DataType } from "./type.d.ts";
const { Option } = Select;
const { TextArea } = Input;

const Index: React.FC<{
  open: boolean;
  submitDrawer: (res: any) => void;
  onClose: () => void;
  editData: Partial<DataType>;
  action: string;
}> = ({ open, submitDrawer, onClose, editData, action }) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    // 需要将相关数据插入到用户信息表中
    form.validateFields().then((res) => {
      let params = {
        userId: action === "E" ? editData?.userId : guid(),
        ...res,
      };
      submitDrawer(params);
    });
  };

  return (
    <Drawer
      title={action === "A" ? "新增" : "编辑"}
      width={"60%"}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button htmlType="submit" type="primary" onClick={onFinish}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={action === "E" ? editData : {}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="姓名"
              rules={[{ required: true, message: "请输入您的姓名" }]}
            >
              <Input placeholder="请输入您的姓名" disabled={action === "E"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="age"
              label="年龄"
              rules={[{ required: true, message: "请输入您的年龄" }]}
            >
              <InputNumber
                placeholder="请输入您的年龄"
                min={0}
                max={1000}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="weight"
              label="体重"
              rules={[{ required: true, message: "请输入您的体重" }]}
            >
              <Input placeholder="请输入您的体重" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="score"
              label="分数"
              rules={[{ required: true, message: "请输入您的初始分数" }]}
            >
              <InputNumber
                placeholder="请输入您的初始分数"
                min={0}
                max={1000}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: "请选择状态" }]}
            >
              <Select placeholder="请选择状态">
                <Option value="1">1分</Option>
                <Option value="2">2分</Option>
                <Option value="3">3分</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="description" label="备注">
              <TextArea showCount maxLength={100} placeholder="其它" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ required: true, message: "请输入您的邮箱" }]}
            >
              <Input placeholder="请输入您的邮箱" disabled={action === "E"} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default Index;

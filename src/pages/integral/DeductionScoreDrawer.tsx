import React, { useState } from "react";
import { Button, Col, Drawer, Form, Input, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import { useRequest } from "ahooks";
import { QueryUserInfoAPI } from "@/service/api/user";
import { guid } from "@/utils";
import type { UserInfoType } from "./type.d.ts";

const { Option } = Select;
const { TextArea } = Input;

const Index: React.FC<{
  open: boolean;
  submitDrawer: (res: any) => void;
  onClose: () => void;
  editData: any;
  action: string;
}> = ({ open, submitDrawer, onClose, editData, action }) => {
  const [form] = Form.useForm();
  const [userList, setUserList] = useState<UserInfoType[]>([]); //存储被扣分人的用户信息

  // 提交信息后的操作
  const onFinish = () => {
    // 需要将扣分细则插入到用户信息表中
    form.validateFields().then((res) => {
      // 根据userId拿到当前被扣分人信息
      let rowCurrent: any = userList.find((item) => item.userId === res.userId);
      let params = {
        ...rowCurrent,
        updateTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        deductionTime:
          action === "E"
            ? editData?.deductionTime
            : dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        scoreId: action === "E" ? editData?.scoreId : guid(),
        score:
          action === "E"
            ? editData.score + editData.deductionScore - res.deductionScore
            : rowCurrent.score - res.deductionScore,
        deductionPerson: "wj",
        ...res,
      };
      submitDrawer(params);
    });
  };

  // 请求个人信息接口
  useRequest(() => QueryUserInfoAPI(), {
    debounceWait: 100,
    onSuccess: (res: UserInfoType[]) => {
      setUserList(res);
    },
  });

  return (
    <Drawer
      title={action === "A" ? "扣分" : "编辑"}
      // width={520}
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
              name="userId"
              label="姓名"
              rules={[{ required: true, message: "请选择被扣分人" }]}
            >
              <Select
                disabled={action === "E"}
                placeholder="请选择被扣分人"
                options={userList}
                fieldNames={{ label: "username", value: "userId" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deductionScore"
              label="扣除分"
              rules={[{ required: true, message: "请选择扣除分数" }]}
            >
              <Select placeholder="请选择扣除分数">
                <Option value={1}>1分</Option>
                <Option value={2}>2分</Option>
                <Option value={5}>5分</Option>
                <Option value={10}>10分</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="deductionReason"
              label="扣分原因"
              rules={[{ required: true, message: "请输入扣分原因" }]}
            >
              <TextArea
                showCount
                maxLength={100}
                placeholder="请输入扣分原因"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="description" label="备注">
              <TextArea showCount maxLength={100} placeholder="其它" />
            </Form.Item>
          </Col>
        </Row>
        {/* <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Space> */}
      </Form>
    </Drawer>
  );
};

export default Index;

import React, { useRef } from "react";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Form, Input, Row } from "antd";
import _ from "lodash-es";
import { validEmail, verifyUserPassword } from "@/utils/check";
import type { LoginInfoType } from "../type";

const Index = ({
  handleLoginInfoMsg,
  onSendUsername,
  status,
  children,
}: {
  handleLoginInfoMsg: any;
  status: string; // 登录还是注册  登录login 注册register
  children?: any;
  onSendUsername?: (param: string) => void;
}) => {
  const [form] = Form.useForm();
  const pwdRef = useRef(null);
  const actRef = useRef(null);
  const onFinish = (fieldValues: LoginInfoType) => {
    handleLoginInfoMsg.run(fieldValues);
  };
  return (
    <Form
      form={form}
      name="horizontal_login"
      layout="vertical"
      onFinish={onFinish}
    >
      <Row
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Col span={24}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                validator: validEmail,
              },
            ]}
          >
            <Input
              ref={actRef}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="<用户名>@<163.com>"
              style={{ width: "360px" }}
              allowClear
              maxLength={64}
              onChange={(e) => {
                let val = e.target.value;
                onSendUsername && onSendUsername(val);
              }}
              onPressEnter={() => {
                form
                  .validateFields(["username", "password"])
                  .then()
                  .catch((err) => {
                    if (!err?.errorFields?.[0].name.includes("username")) {
                      if (err?.errorFields?.[0].name.includes("password")) {
                        (pwdRef.current as any).focus();
                      } else {
                        return onFinish;
                      }
                    }
                  });
              }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="password"
            label="用户密码"
            rules={[
              {
                required: true,
                validator: verifyUserPassword,
              },
            ]}
          >
            <Input.Password
              ref={pwdRef}
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="请输入用户登录密码：8-32位"
              style={{ width: "360px" }}
              allowClear
              maxLength={32}
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onPressEnter={() => {
                form
                  .validateFields(["password", "username"])
                  .then()
                  .catch((err) => {
                    if (!err?.errorFields?.[0].name.includes("password")) {
                      if (err?.errorFields?.[0].name.includes("username")) {
                        (actRef.current as any).focus();
                      } else {
                        return onFinish;
                      }
                    }
                  });
              }}
            />
          </Form.Item>
        </Col>
        {children}
        <Col span={24}>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                style={{ width: "360px", background: "#1170f6" }}
                htmlType="submit"
                loading={handleLoginInfoMsg.loading}
              >
                {status === "login" ? "登录" : "注册"}
              </Button>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Index;

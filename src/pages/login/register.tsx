import { startSakura } from "@/utils/sakura";
import { registerUserAPI, sendMailCodeAPI } from "@/service/api/login";
import { useRequest } from "ahooks";
import { Button, Col, InputNumber, Form, notification, Row } from "antd";
import { useEffect, useState, useRef } from "react";
import { history } from "umi";
import md5 from "md5";
import style from "./style.less";
import CommonForm from "./components/common";
import { guid } from "@/utils";
import type { LoginInfoType } from "./type";

export default function Index() {
  const [username, setUsername] = useState("");
  const [disable, setDisabled] = useState(false);
  const [code, setCode] = useState("发送验证码");
  const [count, setCount] = useState(60);
  const countRef = useRef(1);
  /**
   * 注册用户接口
   */
  const handleRegisterInfo = useRequest(
    (fieldValues: LoginInfoType) =>
      registerUserAPI({
        ...fieldValues,
        password: md5(fieldValues?.password),
        userId: guid(),
      }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        history.push({ pathname: "/login" }, { username });
      },
    }
  );
  //   发送验证码
  const sendVerifyCode = useRequest(() => sendMailCodeAPI({ mail: username }), {
    debounceWait: 100,
    manual: true,
  });
  //获取验证码
  const getVerCode = () => {
    if (username) {
      sendVerifyCode.run();
      let timer = setInterval(() => {
        if (countRef.current < 1) {
          setDisabled(false);
          setCode("获取验证码");
          setCount(60);
          countRef.current = 60;
          clearInterval(timer);
        } else {
          setDisabled(true);
          setCount((count) => {
            setCode(count + "秒后重发");
            countRef.current = count;
            return count - 1;
          });
        }
      }, 1000);
    } else {
      notification.error({
        message: "验证码发送失败",
        description: "请先输入邮箱号码",
      });
    }
  };
  //   接收用户输入框的信息
  const getUsernameInfo = (param: string) => {
    setUsername(param);
  };
  // 樱花效果
  useEffect(() => {
    startSakura();
  }, []);
  return (
    <div className={style.all}>
      <div className={style.login}>
        <div className={[style.title, style.text].join(" ")}>积分注册界面</div>
        <CommonForm
          handleLoginInfoMsg={handleRegisterInfo}
          onSendUsername={getUsernameInfo}
          status="register"
        >
          <Row className={style.verifyCode} gutter={8}>
            <Col span={17}>
              <Form.Item
                name="verifyCode"
                label="验证码"
                rules={[
                  {
                    required: true,
                    message: "请输入您的验证码",
                  },
                ]}
              >
                <InputNumber
                  placeholder="请输入您的验证码"
                  style={{ width: "100%" }}
                  maxLength={6}
                  onPressEnter={() => {}}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Button
                className={style.btnCode}
                disabled={disable}
                style={
                  disable
                    ? {
                        opacity: 0.6,
                        cursor: "not-allowed", //不能点击的效果
                        pointerEvents: "none" /* 阻止鼠标事件 */,
                        color: "#cfd0d3", //置灰的颜色
                      }
                    : {
                        opacity: 1,
                        background: "green",
                        color: "#fff",
                        borderColor: "green",
                      }
                }
                onClick={getVerCode}
              >
                {code}
              </Button>
            </Col>
          </Row>
        </CommonForm>
        <div className={style.lastBtn}>
          <Button
            type="link"
            onClick={() => {
              history.push("/login");
            }}
          >
            去登录
          </Button>
        </div>
      </div>
      <p className={style.filingNumber}>
        ©2016-2024 青女王食品股份有限公司 版权所有 浙ICP备1532853号
      </p>
    </div>
  );
}

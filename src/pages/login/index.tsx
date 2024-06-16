import { setToken } from "@/utils/localToken";
import { startSakura } from "@/utils/sakura";
import { loginUserAPI } from "@/service/api/login";
import { useRequest } from "ahooks";
import { Button } from "antd";
import { useEffect } from "react";
import { history } from "umi";
import md5 from "md5";
import style from "./style.less";
import CommonForm from "./components/common";
import type { LoginInfoType } from "./type";

export default function Index() {
  const handleLoginInfoMsg = useRequest(
    (fieldValues: LoginInfoType) =>
      loginUserAPI({ ...fieldValues, password: md5(fieldValues?.password) }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: async (res: any) => {
        // 存储token以及login信息
        await setToken(res?.token);
        localStorage.setItem(
          "login-info",
          JSON.stringify({ ...res, loginPath: "/login" })
        );
        // 语音提示用户登录成功
        const utterThis = new window.SpeechSynthesisUtterance(
          "恭喜你登录成功" + res?.username + "欢迎回来！"
        );
        window.speechSynthesis.speak(utterThis);
        history.push("/home");
      },
    }
  );

  // 樱花效果
  useEffect(() => {
    startSakura();
  }, []);
  return (
    <div className={style.all}>
      <div className={style.login}>
        <div className={[style.title, style.text].join(" ")}>积分登录界面</div>
        <CommonForm handleLoginInfoMsg={handleLoginInfoMsg} status="login" />
        <div className={style.lastBtn}>
          <Button
            type="link"
            onClick={() => {
              history.push("/register");
            }}
          >
            去注册
          </Button>
        </div>
      </div>
      <p className={style.filingNumber}>
        ©2016-2024 青女王食品股份有限公司 版权所有 浙ICP备1532853号
      </p>
    </div>
  );
}

import React, { useState } from "react";
import { history } from "umi";
import md5 from "md5";
import { useRequest } from "ahooks";
import { registerUserAPI } from "@/service/api/login";
import styles from "./style.less";
import "./style.less";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPwd] = useState("");

  /**
   * 注册用户接口
   */
  const registerUserAPIRun = useRequest(
    (params: any) => registerUserAPI(params),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: () => {
        history.push({ pathname: "/login" }, { username });
      },
    }
  );
  const handleLogin = () => {
    registerUserAPIRun.run({ username, password: md5(password) });
  };
  return (
    <div className={styles.login}>
      <div className={styles.showImg}>9999</div>
      <div className={styles.userInfo}>
        <div className="login-box">
          <form>
            <div className="user-box">
              <input
                type="text"
                name=""
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                name=""
                required
                value={password}
                onChange={(e) => {
                  setPwd(e.target.value);
                }}
              />
              <label>Password</label>
            </div>
            <center>
              <a onClick={handleLogin}>
                注册
                <span></span>
              </a>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

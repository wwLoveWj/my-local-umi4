import { setToken } from "@/utils/localToken";
import { startSakura } from "@/utils/sakura";
import { loginUserAPI } from "@/service/api/login";
import {
  getMenuIdsByroleIdByUserId,
  queryMenuListAPI,
  getMenuListByRole,
} from "@/service/api/roles";
import { transformRoutes } from "@/utils";
import vstores from "vstores";
import { useRequest } from "ahooks";
import { Button } from "antd";
import { useEffect } from "react";
import { history, useIntl } from "umi";
import md5 from "md5";
import style from "./style.less";
import "./style.less";
import CommonForm from "./components/common";
import type { LoginInfoType } from "./type";

export default function Index() {
  // 国际化配置
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  const handleLoginInfoMsg = useRequest(
    (fieldValues: LoginInfoType) =>
      loginUserAPI({ ...fieldValues, password: md5(fieldValues?.password) }),
    {
      debounceWait: 100,
      manual: true,
      onSuccess: async (res: any) => {
        // 存储token以及login信息
        await setToken(res?.token);
        // 语音提示用户登录成功
        // const utterThis = new window.SpeechSynthesisUtterance(
        //   "恭喜你登录成功" + res?.username + "欢迎回来！"
        // );
        // window.speechSynthesis.speak(utterThis);
        // 根据userId查到roleId，再通过roleId链表查询到menusId
        const result = await getMenuIdsByroleIdByUserId({
          userId: res?.userId,
        });
        //  根据menuIds查到对应的菜单列表
        const routesData = await getMenuListByRole({
          menuIds: result[0]?.menuIds,
        });
        // 获取转换成树形路由数据
        const extraRoutes = transformRoutes(routesData, 0, 0);

        // 查询权限分配菜单所有项
        const menus = await queryMenuListAPI({});
        menus.map((item: { title: string }) => {
          item.title = t(item.title);
        });
        const permissionMenuList = transformRoutes(menus, 0, 0);
        vstores.set("login-info", {
          ...res,
          loginPath: "/login",
          extraRoutes,
          permissionMenuList,
        });
        // history.push("/home");
        window.location.href = "http://" + window.location.host + "/home";
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
        ©2016-2024 青女王法律咨询有限公司 版权所有 浙ICP备1532853号
      </p>
    </div>
  );
}

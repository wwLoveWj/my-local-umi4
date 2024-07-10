import {
  Outlet,
  useLocation,
  useIntl,
  useRouteProps,
  useModel,
  KeepAlive,
} from "umi";
// import { KeepAlive } from "umi-plugin-keep-alive";
import React, { useState, useEffect, useRef } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LaptopOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  theme,
  Avatar,
  Badge,
  Dropdown,
  Button,
} from "antd";
import { routes } from "@/routes"; // 配置的菜单项
import _ from "lodash-es"; // 引入JS工具库
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import LangChgIndex from "./components/LangChgIndex";
import SideBarRender from "./components/Menu";
import SwitchTheme from "@/components/switchTheme";
import PageTabs from "./components/PageTabs";
import { getAllNodes, getTagTitle, getCurrentTime } from "@/utils";
import type { MenuProps } from "antd";
import type { RouterItem, MenuType } from "./type";
import "./style.less";

const { Header, Content, Sider } = Layout;
// 获取到所有的菜单数据进行处理
// const menus =
//   routes
//     ?.find((route) => route.path === "/")
//     ?.routes?.filter((item: any) => !item.redirect) || [];

interface Iprops {
  avatarItems: MenuProps["items"];
  rolesList: string[];
  projectName: string;
}
const Index: React.FC<Iprops> = ({ avatarItems, rolesList, projectName }) => {
  const countDownTimer = useRef<any>(null); // 倒计时标记
  const [timeView, setTimeView] = useState<any>(null); // 倒计时显示
  const connectInfo = (window.navigator as any).connection;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const { path, title, id } = useRouteProps();
  const [breadcrumbItems, setBreadcrumbItems] = useState<
    { title: any; path: string; className?: string }[]
  >([]); //面包屑的配置项
  const [themeMenu, setThemeMenu] = useState<MenuType>("dark");
  const [checkedTheme, setCheckedTheme] = useState(true); //是否切换主题
  const [themeColor, setThemeColor] = useState("#001629"); //切换headers主题
  const [themeColorLang, setThemeColorLang] = useState("#fff");
  const { pathname } = useLocation();
  // 国际化配置
  const intl = useIntl();
  const lang = intl.locale;
  const t = (id: string) => intl.formatMessage({ id: title });
  // 全局初始值
  const { initialState, loading, error, refresh, setInitialState } =
    useModel("@@initialState");

  // 切换主题
  const handleChange = (e: any) => {
    if (e.target.checked) {
      //黑夜模式
      setThemeMenu("dark");
      setThemeColor("#001629");
      setThemeColorLang("#fff");
      setCheckedTheme(true);
    } else {
      //白天模式
      setThemeMenu("light");
      setThemeColor("#f5f5f5");
      setThemeColorLang("#000");
      setCheckedTheme(false);
    }
  };
  // 路由变化设置选择项
  const initSetTabs = (path: string) => {
    const newAllRoutes = getAllNodes(routes);
    // 拿到当前路由对象信息
    let routeItem: any = newAllRoutes.find(
      (val: RouterItem) => val.key === path.split("/")[1]
    );
    let arr = [];
    // 存在子路由的项
    if (routeItem?.routes?.length > 0) {
      const pathTitle = getTagTitle("/" + path.split("/")[1], routes);
      arr.push({
        path,
        title: (
          <>
            <LaptopOutlined />
            <span>{t(pathTitle)}</span>
          </>
        ),
        className: "disabled-breadcrumb-item",
      });
    }
    // 不存在子路由的项
    const pathTitle1 = getTagTitle(path, routes);
    arr.push({
      path,
      title: t(pathTitle1),
      className: "disabled-breadcrumb-item",
    });
    setBreadcrumbItems([
      {
        path: "/",
        title: <HomeOutlined />,
      },
      ...arr,
    ]);
  };
  // 切换路由以及变更语言时路由内容都会有变化
  useEffect(() => {
    pathname !== "/" && initSetTabs(pathname);
  }, [pathname, lang]);

  useEffect(() => {
    countDownTimer.current = setInterval(() => {
      setTimeView(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(countDownTimer.current);
    };
  }, []);

  return (
    <Layout>
      <Layout>
        {/* 左侧菜单路由 */}
        <Sider
          className="sider-area-menu"
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="logo">
            <div>{collapsed ? <UserOutlined /> : projectName}</div>
          </div>
          <SideBarRender
            menus={initialState?.menuRoutes as RouterItem[]}
            theme={themeMenu}
          />
        </Sider>
        {/* 右侧内容区 */}
        <Layout style={{ background: "#f0f3f4" }}>
          <Header
            style={{
              background: themeColor,
              display: "none",
            }}
            className="allHeaderInfo"
          >
            <div className="settings">
              {/* 是否收起菜单 */}
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "20px",
                  width: 20,
                  height: 64,
                  color: "#fff",
                }}
              />
              <div className="onlineInfo">
                <span>网络状态：{connectInfo.effectiveType}</span>
                <span>延迟：{connectInfo.rtt}ms</span>
                <span>带宽：{connectInfo.downlink} Mb/s</span>
              </div>
              <div style={{ color: "#fff" }}>{timeView}</div>
              {/* 语言的切换 */}
              {rolesList.includes("admin") && (
                <LangChgIndex themeColor={themeColorLang} />
              )}
              {/* 主题的切换 */}
              {rolesList.includes("admin") && (
                <SwitchTheme
                  handleChange={handleChange}
                  checkedTheme={checkedTheme}
                />
              )}
              {/* 个人设置 */}
              <Dropdown
                menu={{ items: avatarItems }}
                placement="bottomRight"
                arrow
              >
                <Badge count={1}>
                  <Avatar
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    style={{
                      backgroundColor: "#f56a00",
                      marginLeft: "12px",
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Dropdown>
            </div>
          </Header>
          <div className="settings-right">
            <Breadcrumb
              style={{ padding: "6px 12px", background: "#fff" }}
              items={breadcrumbItems}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "absolute",
                right: "18px",
                top: "18px",
              }}
            >
              <div>{timeView}</div>
              <Dropdown
                menu={{ items: avatarItems }}
                placement="bottomRight"
                arrow
              >
                <Badge count={1}>
                  <Avatar
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    style={{
                      backgroundColor: "#f56a00",
                      marginLeft: "12px",
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Dropdown>
            </div>
          </div>
          {/* 打开的路由页签 */}
          <PageTabs />
          <Layout style={{ padding: 12 }}>
            <Content
              style={{
                margin: 0,
                // padding: 12, //内部容器的padding
                minHeight: 280,
                // background: colorBgContainer,
                borderRadius: borderRadiusLG,
                // background: "#fff",
                // 高度需要减去headers、面包屑这些
                height: "calc(100vh - 152px + 64px)",
                overflow: "auto",
              }}
            >
              <KeepAlive
                id={id}
                name={path}
                tabName={t(title || "router.home")}
              >
                <Outlet />
              </KeepAlive>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Index;

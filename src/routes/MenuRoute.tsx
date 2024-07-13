import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PayCircleOutlined,
  OpenAIOutlined,
  TagsOutlined,
  SendOutlined,
  BellOutlined,
  ReadOutlined,
  HomeOutlined,
  AudioOutlined,
} from "@ant-design/icons";

export const menuRoutes = [
  /**
   * 菜单的配置项，用于动态渲染：
   *  key: 唯一标志
   *  title: 菜单项值（国际化已开启）
   *  path：用于路由跳转
   *  component：组件所在路径，从pages路径下开始
   *  icon：菜单图标
   *  hidden: 是否隐藏该菜单项
   *  routes：子级菜单项
   */
  {
    key: "home",
    title: "router.home",
    path: "/home",
    icon: HomeOutlined,
    component: "./home/index",
    // routes: [
    //   {
    //     key: "home",
    //     title: "router.home",
    //     path: "/home",
    //     component: "./home/index",
    //   },
    //   {
    //     key: "detail",
    //     title: "router.home.detail",
    //     path: "/home/detail",
    //     component: "./home/Detail",
    //     hidden: true, //隐藏该菜单项，主要是详情、新增、编辑页
    //   },
    // ],
  },
  {
    key: "mails",
    title: "router.mails",
    path: "/mails",
    icon: SendOutlined,
    component: "./mails/index",
  },
  {
    key: "ai",
    title: "router.ai",
    path: "/ai",
    icon: OpenAIOutlined,
    component: "./chatGpt/index",
  },
  {
    key: "link",
    title: "router.link",
    path: "/link",
    icon: TagsOutlined,
    component: "./cardLink/index",
  },
  {
    key: "todo",
    title: "router.todo",
    path: "/todo",
    icon: BellOutlined,
    component: "./todoNotification/index",
  },
  {
    key: "user",
    title: "router.users",
    path: "/user",
    icon: UserOutlined,
    wrappers: ["@/wrappers/auth"],
    component: "./userInfo/index.tsx",
  },
  {
    key: "integral",
    title: "router.integral",
    path: "/integral",
    icon: PayCircleOutlined,
    routes: [
      {
        key: "table",
        title: "router.integral.table",
        path: "/integral/table",
        component: "./integral/index",
      },
      {
        key: "details",
        title: "router.integral.details",
        path: "/integral/details",
        component: "./integral/components/Details",
        hidden: true,
      },
    ],
  },
  {
    key: "article",
    title: "router.article",
    path: "/article",
    icon: ReadOutlined,
    // component: "./article/index",
    routes: [
      {
        key: "table",
        path: "/article/table",
        component: "./article/index",
        title: "router.article.table",
      },
      {
        key: "edit",
        title: "router.article.edit",
        path: "/article/edit",
        component: "./article/components/ArticleCreate.tsx",
        hidden: true,
      },
      {
        key: "create",
        title: "router.article.create",
        path: "/article/create",
        component: "./article/components/ArticleCreate.tsx",
        hidden: true,
      },
    ],
  },
  {
    key: "chat",
    title: "router.chat",
    path: "/chat",
    icon: PayCircleOutlined,
    component: "./chatBot/index",
  },
];

## 项目的创建

1. yarn create umi
2. 包管理采用 yarn

## 项目包的安装

1. yarn add @umijs/plugins -D
2. yarn add antd axios -S
3. yarn add lodash-es -S 一个函数工具库
4. yarn add dayjs -S
5. umi-plugin-keep-alive 缓存页面，防止重复加载
6. md5 前端密码加密
7. ahooks react 的 hooks，多用于请求 useRequest

## 文件说明

1. 项目根目录下的 types/type.d.ts --全局的 ts 类型定义文件，一般多用于声明各种库的 ts 类
2. utils/index --各种常用的封装函数类
3. service --各种请求 api 的封装

## 项目集成情况

1. 20240612
   1. 初始化项目：集成国际化菜单、面包屑路由
   2. 接入 mock 模拟数据,axios 二次简单封装
   3. loading 动画的接入
   4. 初始化项目 css 样式以及滚动条样式
   5. 403、404 页面的封装
   6. keepalive 相关页面缓存插件的引入
   7. 主题切换组件、头像占位
   8. routes 配置结构相关
   9. 一些工具函数的编写

## 待办事项

1. axios 类型的定义
2. axios 类的封装
3. node 项目的接入

## 项目代码规则

1. 尽量不要用中文去判断，需要定义变量存储起来

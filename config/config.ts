import { defineConfig } from "umi";
import { routes } from "../src/routes";

export default defineConfig({
  // history: { type: "hash" },
  // initialState: {},
  // model: {}, // 使用useModel需要这个配置
  routes,
  // 配置别名，对引用路径进行映射。
  alias: {
    "@utils": "/src/utils",
    "@assets": "/src/assets",
    "@service": "/src/service",
  },
  plugins: ["@umijs/plugins/dist/locale", "umi-plugin-keep-alive"],
  locale: {},
});

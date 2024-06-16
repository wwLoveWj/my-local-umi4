import Package from "../../package.json";

const PROJECT_CONFIG = {
  NAME: Package.name,
  VERSION: Package.version,
  TITLE: "创建项目模板",
};
const STORAGE_PARAMS = {
  tokenKey: "system-token",
};
export { PROJECT_CONFIG, STORAGE_PARAMS };

import request from "../request";

interface LoginInfoType {
  token: string;
  username: string;
}
export const registerUserAPI = (params: any): Promise<any> => {
  return request.post("/login/register", params);
};
export const loginUserAPI = (params: any): Promise<LoginInfoType> => {
  return request.post("/login/index", params);
};

// 查询系统登录用户
export const querySystemUsersAPI = (params: any): Promise<LoginInfoType> => {
  return request.get("/login/tableList", params);
};
// 创建系统登录用户
export const createSystemUsersAPI = (params: any): Promise<LoginInfoType> => {
  return request.post("/login/createSystemUsers", params);
};
// 更新用户密码
export const editSystemUsersAPI = (params: any): Promise<LoginInfoType> => {
  return request.post("/login/chgPwd", params);
};

// 发送注册验证码
export const sendMailCodeAPI = (params: any): Promise<any> => {
  return request.post("/code/send", params);
};

// 扫码登录
export const scanCodeAPI = (params: any): Promise<any> => {
  return request.get("/scan/login", params);
};

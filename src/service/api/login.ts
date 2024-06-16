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
// 发送注册验证码
export const sendMailCodeAPI = (params: any): Promise<any> => {
  return request.post("/code/send", params);
};

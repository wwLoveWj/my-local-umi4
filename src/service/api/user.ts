import request from "../request";

export const Login = () => {
  return request.post<{
    token: string;
  }>("/api/user/login");
};

export const QueryUserInfoAPI = (params = {}): Promise<any> => {
  return request.get("/userInfo", params);
};
export const UserInfoCreate = (params: any): Promise<any> => {
  return request.post("/userInfo/create", params);
};
// 更新用户信息
export const UserInfoUpdate = (params: any): Promise<any> => {
  return request.post("/userInfo/edit", params);
};
export const UserInfoDel = (params: any): Promise<any> => {
  return request.post("/userInfo/delete", params);
};

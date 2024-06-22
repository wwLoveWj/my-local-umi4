import request from "../request";

export const Login = () => {
  return request.post<{
    token: string;
  }>("/api/user/login");
};

export const UserInfo = (params = {}): Promise<any> => {
  return request.get("/userInfo", params);
};

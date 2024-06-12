import request from "../request";

export const Login = () => {
  return request.post<{
    token: string;
  }>("/api/user/login");
};

export const UserInfo = (): Promise<any> => {
  return request.get("/userInfo");
};

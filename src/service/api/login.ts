import request from "../request";

export const registerUserAPI = (params: any): Promise<any> => {
  return request.post("/login/register", params);
};
export const loginUserAPI = (params: any): Promise<any> => {
  return request.post("/login/index", params);
};

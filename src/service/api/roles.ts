import request from "../request";

export const getMenuListByRole = (params = {}): Promise<any> => {
  return request.get("/auth/roleMenuByMenuId", {
    params: { ...params },
  });
};

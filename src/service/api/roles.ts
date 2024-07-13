import request from "../request";

export const getMenuListByRole = (params = {}): Promise<any> => {
  return request.get("/auth/roleMenuByMenuId", {
    params: { ...params },
  });
};
// 根据用户id查询角色用户中间表再查询menuIds
export const getMenuIdsByroleIdByUserId = (params = {}): Promise<any> => {
  return request.get("/auth/menuIdsByroleIdByUserId", {
    params: { ...params },
  });
};
// 获取角色列表
export const getRoleListAPI = (params = {}): Promise<any> => {
  return request.get("/auth/roleList", {
    params: { ...params },
  });
};
// 用户授权接口
export const createUserAuthAPI = (params = {}): Promise<any> => {
  return request.post("/auth/userAuth", params);
};
// 解除用户授权
export const revokeAuthorizationAPI = (params = {}): Promise<any> => {
  return request.post("/auth/revokeAuthorization", params);
};
// 查询用户权限接口
export const queryUsersAuthListAPI = (params = {}): Promise<any> => {
  return request.get("/auth/usersAuthList", {
    params: { ...params },
  });
};

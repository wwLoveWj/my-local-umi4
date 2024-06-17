import request from "../request";

// 获取讯飞星火大模型api
export const getModelInfoAPI = (params: any): Promise<any> => {
  return request.get("/api/getModelInfo", params);
};

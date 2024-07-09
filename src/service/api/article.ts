import request from "../request";

// 文章列表信息
export const queryArticleListAPI = (params: any): Promise<any> => {
  return request.get("/article/tableList", params);
};
// 创建文章
export const createArticleInfoAPI = (params: any): Promise<any> => {
  return request.post("/article/create", params);
};
// 编辑文章
export const editArticleInfoAPI = (params: any): Promise<any> => {
  return request.post("/article/edit", params);
};
// 删除对应的文章列表信息
export const delectArticleInfoAPI = (params: any): Promise<any> => {
  return request.post("/article/delete", params);
};
// 根据editorId查询文章对应明细
export const queryArticleDetailsAPI = (params: any): Promise<any> => {
  return request.post("/article/details", params);
};

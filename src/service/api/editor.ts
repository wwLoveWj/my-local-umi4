import request from "../request";

// 设置文章内容
export const setEditorHtmlAPI = (params: any): Promise<any> => {
  return request.post("/editor/setEditorHtml", params);
};
// 根据editorId查询文章对应明细
export const getEditorHtmlAPI = (params: any): Promise<any> => {
  return request.post("/editor/getEditorHtml", params);
};
// 文章列表信息
export const queryEditorListAPI = (params: any): Promise<any> => {
  return request.get("/editor/getEditorTable", params);
};
// 删除对应的文章列表信息
export const delectEditorInfoAPI = (params: any): Promise<any> => {
  return request.post("/editor/delete", params);
};

import request from "../request";

export const QueryTaskInfoAPI = (params = {}): Promise<any> => {
  return request.get("/task/query", params);
};
// 创建任务
export const createReminderTaskAPI = (params = {}): Promise<any> => {
  return request.post("/task/create", params);
};
// 删除任务
export const deleteReminderTaskAPI = (params = {}): Promise<any> => {
  return request.post("/task/delete", params);
};
// 创建任务提醒
export const reminderTaskAPI = (params = {}): Promise<any> => {
  return request.post("/reminder/task", params);
};

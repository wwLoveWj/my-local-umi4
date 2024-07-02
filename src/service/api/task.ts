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
// 批量删除任务
export const batchDelTaskListAPI = (params = {}): Promise<any> => {
  return request.post("/task/batch/delete", params);
};
// 创建任务提醒
export const reminderTaskAPI = (
  params = {}
): Promise<{
  data: {
    userEmail: string;
    reminderContent: string;
    reminderTime: string;
    taskId: string;
  };
}> => {
  return request.post("/reminder/task", params);
};
// 创建定时任务
export const reminderTimeTaskAPI = (params = {}): Promise<any> => {
  return request.post("/reminder/time", params);
};

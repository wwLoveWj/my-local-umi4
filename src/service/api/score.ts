import request from "../request";

export const ScoreInfoAPI = (): Promise<any> => {
  return request.get("/scoreInfo");
};
export const ScoreInfoCreateAPI = (params: any): Promise<any> => {
  return request.post("/scoreInfo/create", params);
};
export const ScoreInfoEditAPI = (params: any): Promise<any> => {
  return request.post("/scoreInfo/edit", params);
};
export const ScoreInfoDeleteAPI = (params: any): Promise<any> => {
  return request.post("/scoreInfo/delete", params);
};
export const ScoreInfoDetailsAPI = (params: any): Promise<any> => {
  return request.post("/scoreInfo/details", params);
};

import request from "../request";

export const queryLinkCardListAPI = (params: any): Promise<any> => {
  return request.get("/link/query", params);
};

export const createLinkCardListAPI = (params: API.CardLinkList) => {
  return request.post("/link/create", params);
};

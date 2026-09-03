import { httpClient } from "../../../api/httpClient.js";

export const storesApi = {
  getAll: () => httpClient.get("/stores"),
  getById: (id: string) => httpClient.get(`/stores/${id}`),
};

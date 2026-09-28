import { httpClient } from "../../../api/httpClient.js";

export const categoriesApi = {
  getAll: () => httpClient.get("/categories"),
};

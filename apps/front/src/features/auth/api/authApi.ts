import { httpClient } from "../../../api/httpClient.js";

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  code?: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    httpClient.post("/auth/register", payload),
  login: (payload: LoginPayload) => httpClient.post("/auth/login", payload),
  logout: () => httpClient.post("/auth/logout"),
  me: () => httpClient.get("/auth/me"),
};

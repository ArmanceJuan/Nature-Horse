import { httpClient } from "../../../api/httpClient.js";

export const otpApi = {
  generateSecret: () => httpClient.get("/otp/generate-secret"),
  enable: (secret: string, code: string) =>
    httpClient.post("/otp/enable", { secret, code }),
};

const API_BASE_URL = "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
  body?: any;
}

const request = async (endpoint: string, options: RequestOptions = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "An error occurred");
  }

  return data;
};

export const httpClient = {
  get: (endpoint: string) => request(endpoint, { method: "GET" }),
  post: (endpoint: string, body?: any) =>
    request(endpoint, { method: "POST", body }),
  put: (endpoint: string, body?: any) =>
    request(endpoint, { method: "PUT", body }),
  delete: (endpoint: string) => request(endpoint, { method: "DELETE" }),
};

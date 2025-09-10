import api from "../config/axios";

const ApiRequests = {
  checkAuth: async () => {
    const response = await api.get("/auth/");
    return { response, status: response.status };
  },
  login: async (data) => {
    const response = await api.post("/auth/login", { ...data });
    return { response, status: response.status };
  },
  signup: async (data) => {
    const response = await api.post("/auth/", data);

    return { response, status: response.status };
  },
  createStore: async (data) => {
    const response = await api.post("/auth/workspace", data);

    return { response, status: response.status };
  },
  changeUser: async (data) => {
    const response = await api.patch("/auth/", data);

    return { response, status: response.status };
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return { response, status: response.status };
  },
};

export default ApiRequests;

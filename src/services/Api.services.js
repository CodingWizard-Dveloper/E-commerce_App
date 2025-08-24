import api from "../config/axios";

const ApiRequests = {
  checkAuth: async () => {
    const response = await api.get("/auth/");
    return { response, status: response.status };
  },
  login: async (data) => {
    const response = await api.patch("/auth/", { ...data });
    return { response, status: response.status };
  },
  signup: async (data) => {
    const response = await api.post("/auth/", { ...data });
    return { response, status: response.status };
  },
};

export default ApiRequests;

import api from "../config/axios";
import { addProduct } from "../slice/product.slice";

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
  changeUser: async (data) => {
    const response = await api.patch("/auth/", data);

    return { response, status: response.status };
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return { response, status: response.status };
  },

  createStore: async (data) => {
    const response = await api.post("/store", data);

    return { response, status: response.status };
  },
  deleteStore: async (data) => {
    const response = await api.delete("/store", { data });
    return { response, status: response.status };
  },
  updateStore: async (data) => {
    const response = await api.patch("/store", data);
    return { response, status: response.status };
  },
  getStore: async () => {
    const response = await api.get("/store");
    return { response, status: response.status };
  },

  addProduct: async (data) => {
    const response = await api.post("/products", data);
    return { response, status: response.status };
  },
  getProducts: async () => {
    const response = await api.get("/products");
    return { response: response.data, status: response.status };
  },
};

export default ApiRequests;

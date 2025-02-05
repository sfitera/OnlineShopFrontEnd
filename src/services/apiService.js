import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getProducts = async () => {
  const response = await apiClient.get("/products");
  return response.data;
};

import axios from 'axios';

// Vytvorenie inštancie axios s predvoleným nastavením
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', // nastav baseURL na základné URL pre tvoje API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funkcia na vykonanie GET požiadavky
export const getData = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response.data; // Vráť dáta z odpovede
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Funkcia na vykonanie POST požiadavky
export const postData = async (url: string, data: any) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data; // Vráť dáta z odpovede
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Funkcia na vykonanie PUT požiadavky
export const putData = async (url: string, data: any) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

// Funkcia na vykonanie DELETE požiadavky
export const deleteData = async (url: string) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export default apiClient;

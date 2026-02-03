import axios from "axios";

export const MEDIA_BASE_URL = "https://go4overseas.co.in/student_backend";

const api = axios.create({
  baseURL: `${MEDIA_BASE_URL}/api/`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    console.log("AXIOS TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

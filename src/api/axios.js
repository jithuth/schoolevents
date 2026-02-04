import axios from "axios";

export const MEDIA_BASE_URL = "https://go4overseas.co.in/student_backend";

const api = axios.create({
  baseURL: `${MEDIA_BASE_URL}/api/`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("access");
        window.location.href = "/login";
        alert("Session expired. Please login again.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;

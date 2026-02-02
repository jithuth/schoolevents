import axios from "axios";

const api = axios.create({
  baseURL: "https://go4overseas.co.in/student_backend/api/",
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

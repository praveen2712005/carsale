import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:2000",
});

instance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");
    console.log("Axios interceptor - token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
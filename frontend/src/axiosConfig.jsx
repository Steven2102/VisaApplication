import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local comment out for later when webserver is running
  //baseURL: 'http://52.62.107.232:5001', // live change for webserver
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage, or from context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;


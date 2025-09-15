import axios from "axios";

const axiosConfig = axios.create({
    baseURL: 'https://money-manager-wh43.onrender.com/api/v1.0',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

const exclude = ["/login", "/register", "/status", "/activate", "/health"];

axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = exclude.some((endpoint) => {
        return config.url?.includes(endpoint);
    });

    if (!shouldSkipToken) {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            window.location.href = '/login';
        } else if (error.response.status === 500) {
            console.error("Server error. Please try again later.");
        }
    } else if (error.code === "ECONNABORTED") {
        console.error("Request failed. Please try again later.");
    }
    return Promise.reject(error);
})

export default axiosConfig;
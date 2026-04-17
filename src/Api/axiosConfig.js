import axios from "axios";

const api = axios.create({
  baseURL: "https://easybuy-backend-xadk.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR (Token removed)
api.interceptors.request.use(
  (config) => {
    // Ab koi token attach nahi ho raha
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (Simplified 401 handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Unauthorized request");
        // Token-related logout logic removed
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const BASE_API = 'http://localhost:8080/api';
const BASE_URL = 'http://localhost:8080';

const ApiClient = axios.create({
  baseURL: BASE_API, // Laravel API base URL
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  withCredentials: true
});

// Automatically add the Bearer token to requests
ApiClient.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem("user")); // Retrieve user data from session storage
  const token = userData?.token; // Extract the token correctly
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// // Capture 401 errors and redirect to sign-in
// ApiClient.interceptors.response.use(
//   (response) => response, 
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("user"); // Clear stored user session
//       window.location.href = '/signin'; // Redirect to the sign-in page
//     }
//     return Promise.reject(error);
//   }
// );

const ApiBasic = axios.create({
  baseURL: BASE_URL, // Laravel API base URL
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle token expiration
ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return ApiClient(originalRequest); // Retry the request with the new token
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


// Function to refresh token
const refreshToken = () => {
    return axios.post(`${BASE_API}/auth/refresh`, {}, { withCredentials: true }).then((response) => {
      const newToken = response.data.token;
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      console.info({newToken});
      userData.token = newToken;
      localStorage.setItem("user", JSON.stringify(userData));
      return newToken;
    }).catch((error) => {
        console.error("Refresh token error:", error);
        // localStorage.removeItem("user");
        // window.location.href = '/signin';
        //throw error;
    })
};



export { ApiClient, ApiBasic }
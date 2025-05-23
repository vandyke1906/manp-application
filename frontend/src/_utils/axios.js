import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Laravel API base URL
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

// Automatically add the Bearer token to requests
ApiClient.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem("user")); // Retrieve user data from session storage
  const token = userData?.token; // Extract the token correctly
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));


const ApiBasic = axios.create({
  baseURL: 'http://localhost:8080', // Laravel API base URL
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});


export { ApiClient, ApiBasic }
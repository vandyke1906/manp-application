import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Laravel API base URL
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const ApiBasic = axios.create({
  baseURL: 'http://localhost:8080', // Laravel API base URL
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});


export { ApiClient, ApiBasic }
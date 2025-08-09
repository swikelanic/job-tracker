import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Use env variable for base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;

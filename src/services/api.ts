import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Change to your deployed URL if needed
});

export default API;

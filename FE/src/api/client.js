import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000', // <- point to backend proxy
  headers: { 'Content-Type': 'application/json' },
});

export default client;

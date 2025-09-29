import axios from 'axios';
import { getAccessToken } from './authService.js';

export async function apiGet(url, options = {}) {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}`, ...(options.headers || {}) };
  return axios.get(url, { ...options, headers });
}

export async function apiPost(url, data, options = {}) {
  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}`, ...(options.headers || {}) };
  return axios.post(url, data, { ...options, headers });
}

import axios from 'axios';
import { config } from '../config.js';

let accessToken = '';
let tokenExpiry = 0;

export async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) return accessToken;

  const payload = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'password',
    username: config.username,
    password: config.password,
    scope: 'dashboard',
  });

  try {
    const res = await axios.post(
      `${config.baseUrl}/oauth/token`,
      payload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    accessToken = res.data.access_token;
    tokenExpiry = now + res.data.expires_in * 1000 - 5000; // renew 5s early
    return accessToken;
  }
  catch (err) {
    console.error('Error fetching access token:', err.response?.data || err.message);
    throw err;
  }
}

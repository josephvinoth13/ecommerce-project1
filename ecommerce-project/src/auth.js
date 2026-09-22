import axios from 'axios';

const TOKEN_KEY = 'ecommerce_auth_token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAuthSession(token) {
  localStorage.setItem(TOKEN_KEY, token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common.Authorization;
}

export function initializeAuth() {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return token;
}

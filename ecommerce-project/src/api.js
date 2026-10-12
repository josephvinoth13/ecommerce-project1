import axios from 'axios';

const BACKEND_URL = 'https://ecommerce-backend-ge1d.onrender.com';

export const api = axios.create({
  baseURL: BACKEND_URL
});

export function getAssetUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/?public\//, '').replace(/^\/+/, '');
  return `${BACKEND_URL}/${normalizedPath}`;
}

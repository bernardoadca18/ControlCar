import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    // 'x-tenant-id': 'uuid-do-tenant ' 
  }
});

api.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('controlcar_tenant_id');
  
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  return config;
});
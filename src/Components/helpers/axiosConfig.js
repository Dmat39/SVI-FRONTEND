import axios from 'axios';

// Token en memoria (no persistente)
let globalToken = null;

export const setToken = (token) => {
  globalToken = token || null;
};

export const getToken = () => globalToken;

export const clearToken = () => {
  globalToken = null;
};

// Cliente general (si se necesitara)
const mainApi = axios.create({
  baseURL: import.meta.env.VITE_APP_ENDPOINT,
  timeout: 10000,
});

// Cliente para incidencias
const incidenceApi = axios.create({
  baseURL: import.meta.env.VITE_APP_ENDPOINT_PRUEBA,
  timeout: 10000,
});

// Interceptor para adjuntar token
const addAuthToken = (config) => {
  if (globalToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${globalToken}`;
  }
  return config;
};

mainApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
incidenceApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Manejo básico de 401: limpiar token en cliente
const handleResponseError = (error) => {
  if (error?.response?.status === 401) {
    clearToken();
  }
  return Promise.reject(error);
};

mainApi.interceptors.response.use((r) => r, handleResponseError);
incidenceApi.interceptors.response.use((r) => r, handleResponseError);

export { mainApi, incidenceApi };



import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import secureStorage from '../services/secureStorage'; // <-- IMPORTAR NOSSA ABSTRAÇÃO

// ... (API_URL e axios.create() continuam os mesmos) ...
const API_URL = 'http://192.168.1.110/laravel-sanctum-api/public/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, 
});

// ========================================================================
// INTERCEPTOR DE REQUEST: Adicionando o Token de Autenticação
// ========================================================================
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const publicRoutes = ['/login', '/register'];
    if (config.url && publicRoutes.includes(config.url)) {
      return config;
    }

    try {
      // USA NOSSA CAMADA DE ABSTRAÇÃO PARA PEGAR O TOKEN
      const token = await secureStorage.getToken();
      
      if (token) {
        console.log('[Axios Interceptor] Token encontrado. Anexando ao cabeçalho.');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('[Axios Interceptor] Nenhum token encontrado para esta requisição.');
      }
    } catch (error) {
      console.error('[Axios Interceptor] Erro ao buscar token do secureStorage:', error);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ========================================================================
// INTERCEPTOR DE RESPONSE: Lidando com Respostas Globais
// ========================================================================
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      console.warn('Unauthorized (401). Token may be invalid or expired.');
      // Aqui poderíamos disparar um evento global para deslogar o usuário.
      // Por exemplo: `eventEmitter.emit('auth-error');`
      // E o AuthContext ouviria esse evento para chamar o signOut.
    }

    return Promise.reject(error);
  }
);

export default api;

import { Client, PaginatedResponse } from '../types/api';
import api from './axios';

/**
 * Busca a lista paginada de clientes da API.
 * @returns Uma Promise que resolve para a resposta paginada contendo os clientes.
 */
export const getClients = async (): Promise<PaginatedResponse<Client>> => {
  try {
    // A rota é '/clients', pois a baseURL já está configurada em axios.ts
    const response = await api.get<PaginatedResponse<Client>>('/clients');
    return response.data;
  } catch (error) {
    // O interceptor do Axios já pode ter tratado o erro, mas podemos logar aqui também.
    console.error('Erro ao buscar clientes:', error);
    // Re-lança o erro para que o componente que chamou a função possa tratá-lo (ex: mostrar uma mensagem de erro na UI)
    throw error;
  }
};

import axios from 'axios';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import secureStorage from '../services/secureStorage'; // <-- NOSSA NOVA ABSTRAÇÃO

// ... (As tipagens continuam as mesmas) ...
interface AuthState {
  token: string | null;
  authenticated: boolean;
  isLoading: boolean;
}

interface AuthContextData extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        // Usa nosso serviço abstrato para buscar o token
        const storedToken = await secureStorage.getToken();
        
        if (storedToken) {
          console.log('[AuthContext] Token encontrado no armazenamento. Autenticando...');
          setAuthState({
            token: storedToken,
            authenticated: true,
            isLoading: false,
          });
        } else {
          console.log('[AuthContext] Nenhum token encontrado no armazenamento.');
          setAuthState({ token: null, authenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao carregar token:', error);
        setAuthState({ token: null, authenticated: false, isLoading: false });
      }
    };

    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] Tentando fazer login em:', api.defaults.baseURL + '/login');

    try {
      const response = await api.post<{ token: string }>('/login', { email, password });
      const { token } = response.data;

      console.log('[AuthContext] Token recebido com sucesso.');

      // Usa nosso serviço abstrato para salvar o token
      await secureStorage.saveToken(token);

      setAuthState({
        token: token,
        authenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // O tratamento de erro continua o mesmo, robusto como antes.
      console.error('[AuthContext] Erro na chamada da API de login.');
      if (axios.isAxiosError(error)) {
        console.error('Detalhes do erro Axios:', { /* ... */ });
      } else {
        console.error('Erro inesperado no signIn:', error);
      }
      throw error;
    }
  };

  const signOut = async () => {
    console.log('[AuthContext] Executando signOut...');
    // Usa nosso serviço abstrato para deletar o token
    await secureStorage.deleteToken();
    setAuthState({ token: null, authenticated: false, isLoading: false });
  };

  const value = {
    ...authState,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ... (O hook useAuth continua o mesmo) ...
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

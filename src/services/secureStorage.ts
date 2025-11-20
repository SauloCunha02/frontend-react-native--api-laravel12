import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

// Interface para nosso serviço de armazenamento, para garantir consistência
interface SecureStorage {
  saveToken: (token: string) => Promise<void>;
  getToken: () => Promise<string | null>;
  deleteToken: () => Promise<void>;
}

// Implementação para plataformas NATIVAS (iOS, Android)
const nativeStorage: SecureStorage = {
  async saveToken(token) {
    await Keychain.setGenericPassword('token', token);
  },
  async getToken() {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  },
  async deleteToken() {
    await Keychain.resetGenericPassword();
  },
};

// Implementação para a plataforma WEB
const webStorage: SecureStorage = {
  async saveToken(token) {
    // Usamos localStorage para a web.
    // Em um app de produção, poderíamos usar cookies com a flag HttpOnly para mais segurança.
    localStorage.setItem('authToken', token);
  },
  async getToken() {
    return localStorage.getItem('authToken');
  },
  async deleteToken() {
    localStorage.removeItem('authToken');
  },
};

// Exporta a implementação correta com base na plataforma atual
const secureStorage: SecureStorage = Platform.OS === 'web' ? webStorage : nativeStorage;

export default secureStorage;

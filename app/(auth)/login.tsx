import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('app1@api.com'); // Valor padrão para facilitar testes
  const [password, setPassword] = useState('Aa123456'); // Valor padrão para facilitar testes
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha os campos de e-mail e senha.');
      return;
    }

    console.log('[LoginScreen] Iniciando tentativa de login...');
    setLoading(true);

    try {
      await signIn(email, password);
      // Se a função signIn for bem-sucedida, o redirecionamento será tratado
      // automaticamente pelo nosso layout raiz (app/_layout.tsx).
      console.log('[LoginScreen] A função signIn() foi concluída com sucesso.');

    } catch (error: any) {
      // Este bloco é crucial. Ele captura qualquer erro lançado pelo AuthContext.
      console.error('[LoginScreen] Erro capturado da função signIn:', error);

      // Tenta extrair uma mensagem de erro amigável para o usuário.
      // 1. Procura por uma mensagem na resposta da API (padrão Laravel).
      // 2. Se não encontrar, usa a mensagem de erro genérica do objeto Error.
      // 3. Como último recurso, usa uma mensagem padrão.
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Ocorreu um erro desconhecido durante o login.';
      
      Alert.alert('Falha no Login', errorMessage);

    } finally {
      // Este bloco sempre será executado, independentemente de sucesso ou falha.
      console.log('[LoginScreen] Finalizando tentativa de login (bloco finally).');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acessar Sistema</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    textAlign: 'center' 
  },
  input: { 
    height: 50, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 8,
    marginBottom: 16, 
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});

export default LoginScreen;

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  RefreshControl // Importado para a funcionalidade "puxar para atualizar"
  ,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { getClients } from '../../src/api/clientService';
import ClientListItem from '../../src/components/ClientListItem';
import { Client } from '../../src/types/api';

export default function HomeScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchClients = useCallback(async () => {
    // Não seta loading para true se for apenas um refresh, para uma UI mais suave
    if (!isRefreshing) {
      setLoading(true);
    }
    setError(null);

    try {
      console.log('[HomeScreen] Buscando clientes...');
      const paginatedResponse = await getClients();

      // =================================================================
      // PONTO DE DEPURAÇÃO CRÍTICO: Inspecionando a resposta da API
      // =================================================================
      console.log(
        '[HomeScreen] Resposta recebida da API:', 
        JSON.stringify(paginatedResponse, null, 2)
      );
      // =================================================================

      // Verificação de segurança para garantir que a resposta tem o formato esperado
      if (paginatedResponse && Array.isArray(paginatedResponse.data)) {
        setClients(paginatedResponse.data);
        console.log(`[HomeScreen] SUCESSO: ${paginatedResponse.data.length} clientes foram definidos no estado.`);
      } else {
        console.error('[HomeScreen] ERRO DE FORMATO: A resposta da API não contém um array em `response.data`.');
        setError('O formato dos dados recebidos é inválido.');
        setClients([]); // Limpa a lista para evitar crashes
      }

    } catch (err) {
      console.error('[HomeScreen] Erro capturado na função fetchClients:', err);
      setError('Não foi possível carregar os clientes. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // `useEffect` para buscar os dados quando o componente é montado pela primeira vez
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Função para o "puxar para atualizar"
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchClients();
  };

  // Renderiza um indicador de carregamento inicial
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.infoText}>Carregando clientes...</Text>
      </View>
    );
  }

  // Renderiza uma mensagem de erro com um botão para tentar novamente
  if (error && clients.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchClients} color="#007AFF" />
      </View>
    );
  }

  // Renderiza a lista de clientes usando FlatList
  return (
    <FlatList
      data={clients}
      renderItem={({ item }) => <ClientListItem client={item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={<Text style={styles.title}>Meus Clientes</Text>}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.infoText}>Nenhum cliente encontrado.</Text>
          <Text style={styles.subInfoText}>Puxe para baixo para atualizar.</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={["#007AFF"]} // Cor do spinner no Android
          tintColor={"#007AFF"} // Cor do spinner no iOS
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20, // Espaço no final da lista
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  subInfoText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

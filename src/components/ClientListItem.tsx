import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Client } from '../types/api';

interface ClientListItemProps {
  client: Client;
}

const ClientListItem: React.FC<ClientListItemProps> = ({ client }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{client.name}</Text>
      <Text style={styles.detail}>{client.email}</Text>
      <Text style={styles.detail}>{client.phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
});

export default ClientListItem;

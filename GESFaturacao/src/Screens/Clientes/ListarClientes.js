import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import { AuthContext } from '../../Context/AuthContext';

export default function ListarClientes({ navigation }) {
  const { getClientes, getClientesById, removerCliente } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarClientes();
  }, []);
  
  const carregarClientes = async () => {
    try {
      const response = await getClientes();
      if (response.data) {
        const clientesWithLockedStatus = await Promise.all(response.data.map(async (cliente) => {
          const clienteDetails = await getClientesById(cliente.id);
          return { ...cliente, locked: clienteDetails.data.used };
        }));
        const sortedClientes = clientesWithLockedStatus.sort((a, b) => a.id - b.id);

        setClientes(sortedClientes);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar Clientes:', error);
    }
  };

  const handleRemoverCliente = async (clienteId) => {
    try {
      await removerCliente(clienteId);
      carregarClientes();
    } catch (error) {
      console.error('Erro ao remover Cliente:', error);
    }
  };

  const keyExtractor = (item) => item.id.toString();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color='#d0933f' />
      </View>
    );
  }
  
  const renderItem = ({ item: cliente }) => (
    <View style={styles.clienteContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Detalhes Clientes', { clienteId: cliente.id })} >
        <View style={styles.rowContainer}>
          <View style={styles.clienteInfo}>
            <Text style={styles.text}>ID: {cliente.id.toString()}</Text>
            <Text style={styles.text}>Nome: {cliente.name}</Text>
            <Text style={styles.text}>NIF: {cliente.vatNumber}</Text>
            <Text style={styles.text}>Email: {cliente.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {cliente.locked !== 1 && (
      <View style={styles.buttonContainer}>
        <Button
          color={'gray'}
          title={'Remover'}
          onPress={() => handleRemoverCliente(cliente.id)}
        />
      </View>
    )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#444444' }}></Text>
      <FlatList
        data={clientes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  clienteContainer: {
    borderWidth: 1,
    borderColor: '#BE6E31',
    flexDirection: 'row',
    width: 350,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom:15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  clienteInfo: {
    padding: 10,
    flexDirection: 'column',
  },
  artigoImage: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginTop: 5, 
    marginBottom: 5,
  },
  text: {
    color: '#444444'
  },
  loading: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
});
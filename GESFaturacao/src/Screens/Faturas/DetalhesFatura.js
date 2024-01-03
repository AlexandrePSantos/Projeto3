import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';

export default function DetalhesFatura({ route }) {
    const { faturaId } = route.params;
    const { getFaturasById } = useContext(AuthContext);
    const [fatura, setFatura] = useState(null);
  
    useEffect(() => {
        getFaturasById(faturaId)
          .then(fetchedFatura => {
            if (fetchedFatura && fetchedFatura.data) {
              const simplifiedFatura = {
                id: fetchedFatura.data.id,
                name: fetchedFatura.data.client.name,
                status: fetchedFatura.data.status,
                // add other properties if needed
              };
              setFatura(simplifiedFatura);
            } else {
              console.error('Fetched fatura is undefined or does not contain data');
            }
          })
          .catch(error => {
            console.error('Error getting fatura:', error);
          });
    }, [faturaId]);
  
    if (!fatura) {
      return <Text>Loading...</Text>;
    }
  
    return (
      <View>
        <Text>ID: {fatura.id}</Text>
        <Text>Cliente: {fatura.name}</Text>
        <Text>Estado: {fatura.status}</Text>
      </View>
    );
}

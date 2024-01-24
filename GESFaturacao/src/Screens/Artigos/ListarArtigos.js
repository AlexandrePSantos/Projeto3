import React, { useState, useEffect, useContext } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import { AuthContext } from '../../Context/AuthContext';

export default function ListarArtigos({ navigation, route }) {
  const { getArtigos, removerArtigo } = useContext(AuthContext);
  const [artigos, setArtigos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarArtigos = async () => {
    try {
      const response = await getArtigos();
      if (response.data) {
        setArtigos(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar Artigos:', error);
    }
  };

  useEffect(() => {
    carregarArtigos();
  }, []);

  const renderItem = ({ item: artigo }) => (
    <View style={styles.artigoContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Detalhes Artigo', { artigoId: artigo.id.toString() })} >
        <View style={styles.rowContainer}>
          <View style={styles.artigoInfo}>
            <Text style={styles.text}>ID: {artigo.id.toString()}</Text>
            <Text style={styles.text}>Preço: {parseFloat(artigo.price).toFixed(2)}</Text>
            <Text style={styles.text}>Preço+Tax: {parseFloat(artigo.pricePvp).toFixed(2)}</Text>
            <Text style={styles.text}>Descrição: {artigo.description.toString()}</Text>
          </View>
          <Image source={{ uri: artigo.image.toString() }} style={styles.artigoImage} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color='#d0933f' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={artigos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e9ec',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  artigoContainer: {
    borderWidth: 1,
    borderColor: '#BE6E31',
    flexDirection: 'row',
    width: 350,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom:15,
    marginLeft:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    alignItems: 'center',
  },
  artigoInfo: {
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
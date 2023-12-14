import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, ScrollView, View, Image } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';

export default function ListarArtigos({ navigation, route }) {
  const { getArtigos } = useContext(AuthContext);
  const [artigos, setArtigos] = useState([]);

  useEffect(() => {
    const carregarArtigos = async () => {
      try {
        const response = await getArtigos();
        if (response.data) {
          setArtigos(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar Artigos:', error);
      }
    };
    carregarArtigos();
  }, []);

  return (
    <ScrollView>
      <Text style={styles.titleSelect}>Lista de Artigos</Text>
      {artigos.map((artigo, index) => (
        <View key={index} style={styles.artigoContainer}>
          <View style={styles.artigoInfo}>
            <Text style={{ color: '#444444'}}>ID: {artigo.id}</Text>
            <Text style={{ color: '#444444'}}>Preço: {parseFloat(artigo.price).toFixed(2)}</Text>
            <Text style={{ color: '#444444'}}>Preço+Tax: {parseFloat(artigo.pricePvp).toFixed(2)}</Text>
            <Text style={{ color: '#444444'}}>Descrição: {artigo.description}</Text>
          </View>
          <Image source={{ uri: artigo.image }} style={styles.artigoImage} />
        </View>
      ))}
    </ScrollView>
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
  touch: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  textfont: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5F5D5C',
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
    color: '#5F5D5C',
  },
  borderMargin: {
    borderWidth: 1,
    borderColor: 'grey',
    marginLeft: 10,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
  },
  dateComponent: {
    width: 350,
  },
  touchableO: {
    width: 350,
    height: 55,
  },
  textDate: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 16,
    color: '#000000',
  },
  marginTOPButton: {
    margin: 20,
  },
  marginTOPButton2: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 7,
  },
  artigoContainer: {
    borderWidth: 1,
    borderColor: '#BE6E31',
    flexDirection: 'row',
    width: 350,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom:15,
    marginLeft:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  artigoInfo: {
    flex: 1,
    padding: 10,
  },
  artigoImage: {
    width: 90,
    height: 90,
    marginLeft: 30,
    marginTop: 5, 
    marginBottom: 5,
    marginRight:3  
  },
  textSelect: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
  },
});

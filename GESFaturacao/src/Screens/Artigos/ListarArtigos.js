import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';

import { AuthContext } from '../../Context/AuthContext';

export default function ListarArtigos({ navigation }) {
  const { getArtigos, getArtigoID, removerArtigo } = useContext(AuthContext);
  const [artigos, setArtigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    carregarArtigos();
  }, []);

  const carregarArtigos = async () => {
    try {
      const response = await getArtigos();
      if (response.data) {
        const artigosWithLockedStatus = await Promise.all(response.data.map(async (artigo) => {
          const artigoDetails = await getArtigoID(artigo.id);
          return { ...artigo, locked: artigoDetails.data.locked };
        }));
        setArtigos(artigosWithLockedStatus);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar Artigos:', error);
    }
  };

  const handleRemoverArtigo = async (artigoId) => {
    try {
      await removerArtigo(artigoId);
      carregarArtigos();
    } catch (error) {
      console.error('Erro ao remover Artigo:', error);
    }
  };

  const keyExtractor = (item) => item.id.toString();

  const CustomButtonModal = ({ title, onPress, styles, gradientColors }) => (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.buttonModal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.modalText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
  const renderItem = ({ item: artigo }) => {
    if ((filtro === 'Usados' && artigo.locked !== 1) || (filtro === 'Não Usados' && artigo.locked === 1)) {
      return null;
    }
  
    return (
      <View style={styles.artigoContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Detalhes Artigo', { artigoId: artigo.id })}>
          <View style={styles.rowContainer}>
            <View style={styles.artigoInfo}>
              <Text style={[styles.text, { marginTop: 5 }]}>ID: {artigo.id.toString()}</Text>
              <Text style={styles.text}>Preço: {parseFloat(artigo.price).toFixed(2)}</Text>
              <Text style={styles.text}>Preço+Tax: {parseFloat(artigo.pricePvp).toFixed(2)}€</Text>
              <Text style={styles.text}>Descrição: {artigo.description.toString()}</Text>
            </View>
            <Image source={{ uri: artigo.image.toString() }} style={styles.artigoImage} />
          </View>
        </TouchableOpacity>
        {(filtro === 'Todos' || (filtro === 'Não Usados' && artigo.locked !== 1)) && artigo.locked !== 1 && (

          <View style={styles.buttonModal}>
          <CustomButtonModal
            styles={styles}
            gradientColors={['#ff0000', '#ffa500']}
            title="Remover" 
            onPress={() => handleRemoverArtigo(artigo.id)}/>
          </View>
        )}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Picker
        style={styles.pickerComponent}
        selectedValue={filtro}
        onValueChange={(itemValue) => setFiltro(itemValue)}
      >
        <Picker.Item label="Todos" value="Todos" />
        <Picker.Item label="Usados" value="Usados" />
        <Picker.Item label="Não Usados" value="Não Usados" />
      </Picker>
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
    backgroundColor: '#fff',
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
    marginBottom: 15,
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
  pickerComponent: {
    height: 50,
    width: '100%',
    color:  'dark',
    backgroundColor:  'dark' ,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'dark',
    borderRadius: 7,
  },
  buttonModal: {
    alignItems: 'center',
    width: 100,
    padding: 10,
    borderRadius:10,
  },
  modalText: {
    color: '#ffffff', // Letras brancas
    fontWeight: 'bold', // Negrito
    textAlign: 'center', // Centralizado
    fontSize: 15,
  },
});

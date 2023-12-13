import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, ScrollView,Button, View } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default function ListarArtigos({navigation, route}) {

const { getArtigos } = useContext(AuthContext);
const [artigos, setArtigos] = useState([]);

useEffect(() => {
    const carregarArtigos = async () => {
      try {
        const response = await getArtigos();
        if (response.data) {
          setArtigos(response.data);
          console.log(response.data); 
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
          <Text>ID: {artigo.id}</Text>
          <Text>Imagem: {artigo.image}</Text>
          <Text>Preço: {artigo.price}</Text>
          <Text>Preço+Tax: {artigo.pricePvp}</Text>
          <Text>Descrição: {artigo.description}</Text>
          {/*
          <Button
            title="Ver Detalhes"
            onPress={() => navigation.navigate('DetalhesFatura', { id: fatura.id })}
          />
      */}
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
    flexDirection:'row',
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
    fontWeight: "bold",
    color: '#5F5D5C',
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
    color: "#5F5D5C",
  },
  borderMargin: {
    borderWidth: 1,
    borderColor: 'grey',
    marginLeft:10,
    marginRight:10,
    height:50,
    justifyContent: 'center',
  },
  dateComponent: {
    width: 350
  },
  touchableO: {
    width: 350,
    height: 55
  },
  textDate: {
    marginLeft:15,
    marginTop:15,
    fontSize: 16,
    color:"#000000"
  },
  marginTOPButton: {
    margin: 20
  },
  marginTOPButton2: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 7
  },
  artigoContainer: {
    width: 350,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },
  textSelect: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold'
  },
});


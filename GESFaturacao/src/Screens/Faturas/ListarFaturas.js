import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, ScrollView,Button, View } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default function ListarFaturas({navigation, route}) {

const { getFaturas } = useContext(AuthContext);
const [faturas, setFaturas] = useState([]);

useEffect(() => {
    const carregarFaturas = async () => {
      try {
        const response = await getFaturas();
        if (response.data) {
          setFaturas(response.data);
          console.log(response.data); 
        }
      } catch (error) {
        console.error('Erro ao carregar faturas:', error);
      }
    };

carregarFaturas();
  }, []); // O segundo argumento do useEffect é uma lista de dependências, neste caso, vazia, o que significa que será executado apenas uma vez.

return (
    <ScrollView>
      <Text style={styles.titleSelect}>Lista de Faturas</Text>
      {faturas.map((fatura, index) => (
        <View key={index} style={styles.faturaContainer}>
          <Text style={styles.textInFaturaContainer}>ID: {fatura.id}</Text>
          <Text style={styles.textInFaturaContainer}>Cliente: {fatura.name}</Text>
          <Text style={styles.textInFaturaContainer}>Estado: {fatura.status}</Text>
          <Text style={styles.textInFaturaContainer}>Data: {fatura.dateFormatted}</Text>
          <Text style={styles.textInFaturaContainer}>Data de expiração: {fatura.expirationFormatted}</Text>
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
  faturaContainer: {
    borderWidth: 1,
    borderColor: '#BE6E31',
    width: 350,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    marginLeft:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  textInFaturaContainer: {
    marginLeft: 10,
    color: '#444444'
  },
  textSelect: {
    margin: 10,
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold'
  },
});


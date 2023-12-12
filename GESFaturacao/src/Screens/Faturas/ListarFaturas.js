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
        const response = await getFaturas(); // Substitua getFaturas pela função correta que busca as faturas
        if (response.data) {
          setFaturas(response.data); // Atualiza o estado com as faturas recebidas
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
          <Text>ID: {fatura.id}</Text>
          <Text>Cliente: {fatura.cliente}</Text>
          {/* Adicione mais detalhes da fatura conforme necessário */}
          <Button
            title="Ver Detalhes"
            onPress={() => navigation.navigate('DetalhesFatura', { id: fatura.id })}
          />
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
      
    },
    touch: {
        flex:1,
        alignItems: 'center',
        marginTop:10,
        backgroundColor: '#d0933f',
    },
    button: {
      alignItems:'center',
      backgroundColor:'#d0933f',
      marginTop:16,
      marginBottom:5,
      width: 300,
      padding: 10,
    },
    icon: {
      position:'absolute',
      left:50,
    },
    textfont: {
      fontSize: 25,
      fontWeight: "bold",
      color:'#ffffff',
    },
    pickerComponent: {
      width: 350,
      
    },
    textSelect: {
      fontSize: 20,
      padding: 10,
      fontWeight: 'bold'
    },
    titleSelect: {
      fontSize: 20,
      margin: 10,
      fontWeight: "bold",
      color: "#5F5D5C"
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
    }
  });
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, ScrollView,Button, View } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default function ListarOrcamentos({navigation, route}) {

const { getOrcamentos } = useContext(AuthContext);
const [orcamentos, setOrcamentos] = useState([]);

useEffect(() => {
    const carregarOrcamentos = async () => {
      try {
        const response = await getOrcamentos();
        if (response.data) {
          setOrcamentos(response.data);
          console.log(response.data); 
        }
      } catch (error) {
        console.error('Erro ao carregar Orçamentos:', error);
      }
    };

carregarOrcamentos();
  }, []); 

return (
    <ScrollView>
      <Text style={styles.titleSelect}>Lista de Orçamentos</Text>
      {orcamentos.map((orcamento, index) => (
        <View key={index} style={styles.orcamentoContainer}>
          <Text>ID: {orcamento.id}</Text>
          <Text>Cliente: {orcamento.name}</Text>
          <Text>Estado: {orcamento.status}</Text>
          <Text>Data: {orcamento.dateFormatted}</Text>
          <Text>Data de expiração: {orcamento.expirationFormatted}</Text>
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
  orcamentoContainer: {
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


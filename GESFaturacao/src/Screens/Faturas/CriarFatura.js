import React, { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet, Text, View, ScrollView,ToastAndroid, } from 'react-native';
import { AuthContext } from "../../Context/AuthContext";
import { Picker } from '@react-native-picker/picker';

export default function CriarFatura({ navigation }) {
  const { CriarFatura } = useContext(AuthContext);
  const { getClientes } = useContext(AuthContext);
  const { getSeries } = useContext(AuthContext);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);

  const [clienteC, setCliente] = useState();
  const [serieC, setSerie] = useState();
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await getClientes();
        const seriesResponse = await getSeries();

        if (clientesResponse.data) {
          setDadosClientes(clientesResponse.data);
          console.log(clientesResponse.data);
        }

        if (seriesResponse.data) {
          setDadosSeries(seriesResponse.data);
          console.log(seriesResponse.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCreateFatura = () => {
    // Define the variables here
    const clienteC = clienteC;
    const serieC = serieC;
    const numeroC = '';
    const dataC = '';
    const validadeC = '';
    const referenciaC = '';
    const vencimentoC = '';
    const moedaC = '';
    const descontoC = '';
    const observacoesC = '';
    const LinhasC = '';
    const finalizarDocumentoC = '';

    console.log(clienteC)
    CriarFatura(
      clienteC, serieC, 
      numeroC, dataC, 
      validadeC, referenciaC, 
      vencimentoC, moedaC, 
      descontoC, observacoesC, 
      LinhasC, finalizarDocumentoC
    ).then(response => {
      console.log(response + ' Resposta Criar Orçamento')
      navigation.navigate('GesFaturação');
      ToastAndroid.show("Fatura Criada ", ToastAndroid.SHORT);
    });
  }

  return (
    <ScrollView>
    <View style={styles.container}>

      
      <View style={{marginTop: 10}}>
        {/* Cliente */}
        <Text style={styles.titleSelect}>Client</Text>
        <View style={styles.borderMargin}>
        <Picker style={styles.pickerComponent} selectedValue={selectedIdCliente} onValueChange={itemValue => { setSelectedIdCliente(itemValue); setCliente(itemValue); }} >
          <Picker.Item label="Selecione um cliente" value={null} />
          {dadosClientes.map(function (client, i) { return <Picker.Item label={client.name} value={client.id.toString()} key={i} />; })}
        </Picker>
        </View>
        {/* Serie */}
        <Text style={styles.titleSelect}>Series</Text>
          <View style={styles.borderMargin}>
          <Picker style={styles.pickerComponent} selectedValue={selectedIdSerie} onValueChange={itemValue => {setSelectedIdSerie(itemValue); setSerie(itemValue)}} >
            <Picker.Item label="Selecione uma serie" value={null} />
            {dadosSeries.map(function (serie, i) { return <Picker.Item label={serie.description} value={serie.id.toString()} key={i} />; })}
          </Picker>
          </View>
        {/* number */}

        {/* date */}

        {/* expiration */}

        {/* reference */}

        {/* dueDate */}

        {/* Coin */}

        {/* discount */}

        {/* observations */}

        {/* finalize */}

        {/* payment */}

        {/* lines/artigos */}

        {/* doc_origin */}

      </View>
      <View style={{marginTop: 30,marginBottom: 10 ,width: 350}}>
      <Button  title="Criar Fatura" color="#d0933f" onPress={() => handleCreateFatura()} />
      </View>
      </View>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#d0933f',
    marginTop: 16,
    width: 300,
    padding: 10,
  },
  textfont: {
    color: "#ffffff",
    fontSize: 16,
    fontweight: "bold"

  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
    color: "#5F5D5C"
  },
  pickerComponent: {
    width: 350,

  },
  borderMargin: {
    borderWidth: 1,
    borderColor: 'grey',

  },
  touchableO: {
    width: 350,
    height: 55,
    justifyContent: "center"
  }
});
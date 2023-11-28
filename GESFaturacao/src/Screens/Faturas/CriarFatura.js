import React, { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput,ScrollView,ToastAndroid,LogBox  } from 'react-native';
import { AuthContext } from "../../Context/AuthContext";
import { Picker } from '@react-native-picker/picker';

export default function CriarFatura({ navigation }) {
  const { userToken } = useContext(AuthContext);
  const { getClientes } = useContext(AuthContext);
  const { CriarFatura } = useContext(AuthContext);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [clienteC, setCliente] = useState();
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);

  useEffect(() => {
    getClientes().then((res) => {
      console.log(res.data)
      setDadosClientes(res.data.aaData)
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const handleCreateFatura = () => {
    // Define the variables here
    const serieC = '';
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

      {/* Cliente */}
      <View style={{marginTop: 10}}>
        <Text style={styles.titleSelect}>Client</Text>
        <View style={styles.borderMargin}>
        <Picker  style={styles.pickerComponent} placeholder="Selecione um cliente" selectedValue={selectedIdCliente} onValueChange={itemValue => {
          setSelectedIdCliente(itemValue);
          setCliente(itemValue[0]);}}>
          {dadosClientes.map(function (object, i) {
            return <Picker.Item label={object[2]} value={object[0]} key={i} />;
          })}
        </Picker>
        </View>
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
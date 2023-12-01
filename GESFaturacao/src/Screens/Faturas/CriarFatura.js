import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Item,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';

export default function CriarFatura({ navigation }) {
  const { CriarFatura } = useContext(AuthContext);
  const { getClientes } = useContext(AuthContext);
  const { getSeries } = useContext(AuthContext);
  const { getArtigos } = useContext(AuthContext);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);
  const [dadosArtigos, setDadosArtigos] = useState([]);

  
  const [referenciaC, setReferencia] = useState('');
  const [moedaC, setMoeda] = useState('1'); // Valor inicial '1' para 'Euro (€)'
  const [descontoC, setDesconto] = useState('0'); // Valor inicial '0'
  const [observacoesC, setObservacao] = useState('');
  const [finalizarDocumentoC, setFinalizarDocumento] = useState(0);
  const [clienteC, setCliente] = useState();
  const [serieC, setSerie] = useState();

  const [dataC, setData] = useState();
  const [openc, setopenc] = useState(false);
  const [dataV, setDatev] = useState(new Date());
  const [openv, setopenv] = useState(false);
  const [validadeC, setValidade] = useState('');

  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [selectedIdArtigo, setSelectedIdArtigo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await getClientes();
        const seriesResponse = await getSeries();
        const artigosResponse = await getArtigos();

        if (clientesResponse.data) {
          setDadosClientes(clientesResponse.data);
        }

        if (seriesResponse.data) {
          setDadosSeries(seriesResponse.data);
        }

        if (artigosResponse.data) {
          setDadosArtigos(artigosResponse.data);
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
  
    console.log(clienteC);
    CriarFatura(
      clienteC,
      serieC,
      numeroC,
      dataC,
      validadeC,
      referenciaC,
      vencimentoC,
      moedaC,
      descontoC,
      observacoesC,
      LinhasC,
      finalizarDocumentoC,
    ).then(response => {
      console.log(response + ' Resposta Criar Fatura');
      navigation.navigate('GesFaturação');
      ToastAndroid.show('Fatura Criada ', ToastAndroid.SHORT);
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{marginTop: 10}}>
          {/* Cliente */}
          <Text style={styles.titleSelect}>Client</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdCliente}
              onValueChange={itemValue => {
                setSelectedIdCliente(itemValue);
                setCliente(itemValue);
              }}
            >
              <Picker.Item label="Selecione um cliente" value={null} />
              {dadosClientes.map((client, i) => (
                <Picker.Item
                  label={client.name}
                  value={client.id.toString()}
                  key={i}
                />
              ))}
            </Picker>
          </View>
          {/* Serie */}
          <Text style={styles.titleSelect}>Series</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdSerie}
              onValueChange={itemValue => {
                setSelectedIdSerie(itemValue);
                setSerie(itemValue);
              }}
            >
              <Picker.Item label="Selecione uma serie" value={null} />
              {dadosSeries.map((serie, i) => (
                <Picker.Item
                  label={serie.description}
                  value={serie.id.toString()}
                  key={i}
                />
              ))}
            </Picker>
          </View>
          {/* date */}
          <Text style={styles.titleSelect}>Data</Text>
          <View style={styles.borderMargin}>
            <TouchableOpacity onPress={() => setopenc(true)} style={styles.touchableO}>
              <DatePicker 
                modal 
                mode="date" 
                open={openc} 
                date={new Date()} 
                onConfirm={dataC => {
                  setopenc(false);
                  if (moment(dataC).isBefore(moment(validadeC, 'DD/MM/YYYY'))) {
                    setData(dataC);
                  } else {
                    alert('Selected date must be less than validade');
                  }
                }} 
                onCancel={() => setopenc(false)}
              />
              <Text> {' '} {(todaiDate = moment(dataC).format('DD/MM/YYYY'))}</Text>
            </TouchableOpacity>
          </View>
          {/* expiration */}
          <Text style={styles.titleSelect}>Validade</Text>
          <View style={styles.borderMargin}>
            <TouchableOpacity onPress={() => setopenv(true)} style={styles.touchableO}>
              <DatePicker 
                modal 
                mode="date" 
                open={openv} 
                date={dataV} 
                onConfirm={validadeC => { 
                  setopenv(false);
                  setDatev(validadeC);
                  setValidade(moment(validadeC).format('DD/MM/YYYY'));
                }} 
                onCancel={() => { setopenv(false); }} 
              />
              <Text style={styles.textDate}> {' '} {moment(dataV).format('DD/MM/YYYY')}</Text>
            </TouchableOpacity>
          </View>

          {/* reference */}
          <Text style={styles.titleSelect}>Referencia</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={referenciaC}
              onChangeText={text => setReferencia(text)}
              placeholder="Referencia"
            />
          </View>

          {/* dueDate */}
          {/* A espera do Engenheiro */}

          {/* Coin */}
          <Text style={styles.titleSelect}>Moeda</Text>
          <View style={styles.borderMargin}>
            <Picker
              selectedValue={moedaC}
              onValueChange={itemValue => setMoeda(itemValue)}
              style={styles.pickerComponent}
            >
              <Picker.Item label="Euro (€)" value="1" />
              <Picker.Item label="Libra ING (GBP)" value="2" />
              <Picker.Item label="Dólar USA ($)" value="3" />
              <Picker.Item label="Real Br. (R$)" value="4" />
              <Picker.Item label="Fr. Suiço (CHF)" value="5" />
            </Picker>
          </View>

          {/* discount */}
          <Text style={styles.titleSelect}>Desconto</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={descontoC}
              onChangeText={text => setDesconto(text)}
              placeholder="Desconto"
              keyboardType="numeric"
            />
          </View>

          {/* observations */}
          <Text style={styles.titleSelect}>Observações</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={observacoesC}
              onChangeText={text => setObservacao(text)}
              placeholder="Observações"
            />
          </View>

          {/* finalize */}
          <Text style={styles.titleSelect}>Finalize</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              placeholder="Finalizado"
              selectedValue={finalizarDocumentoC}
              onValueChange={itemValue => setFinalizarDocumento(itemValue)}
            >
              <Picker.Item label="Rascunho" value="0" />
              <Picker.Item label="Aberto" value="1" />
            </Picker>
          </View>

          {/* payment */}

          {/* lines/artigos */}

          {/* doc_origin */}
          </View>
          <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
            <Button
              title="Criar Fatura"
              color="#d0933f"
              onPress={() => handleCreateFatura()}
            />
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
    color: '#ffffff',
    fontSize: 16
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
    color: '#5F5D5C',
  },
  pickerComponent: {
    width: 350,
  },
  borderMargin: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 15,
    borderRadius: 7,
  },
  touchableO: {
    width: 350,
    height: 55,
    justifyContent: 'center',
  },
});

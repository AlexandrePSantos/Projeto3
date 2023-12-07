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
  // VARIAVEIS PARA OBTER OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO USADOS PARA CARREGAR ARRAYS DOS PICKERS
  const { CriarFatura } = useContext(AuthContext);
  const { getClientes } = useContext(AuthContext);
  const { getSeries } = useContext(AuthContext);
  const { getArtigos } = useContext(AuthContext);
  const { getMetodos } = useContext(AuthContext);

  // ARRAYS PARA GUARDAR OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO MOSTRADOS NOS PICKERS
  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);
  const [dadosMetodo, setDadosMetodo] = useState([]);
  const [dadosArtigos, setDadosArtigos] = useState([]);

  // VARIAVEIS PARA GUARDAR OS IDS DOS CLIENTES, SERIES, ARTIGOS E METODOS SELECIONADOS NOS PICKERS
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [selectedIdArtigo, setSelectedIdArtigo] = useState(null);
  const [selectedMetodo, setSelectedIdMetodo] = useState(null);

  // VARIAVEIS PARA GUARDAR OS DADOS DA FATURA
  // SÃO USADOS PARA ENVIAR PARA A API
  const [ref, setReferencia] = useState('');
  const [moeda, setMoeda] = useState('1'); // Valor inicial '1' para 'Euro (€)'
  const [desc, setDesconto] = useState('0'); // Valor inicial '0'
  const [obs, setObservacao] = useState('');
  const [finalizarDoc, setFinalizarDocumento] = useState(0);
  const [cliente, setCliente] = useState();
  const [serie, setSerie] = useState();
  const [dataIni, setDataIni] = useState(moment().format('DD/MM/YYYY'));
  const [dataVal, setDataVal] = useState(moment().format('DD/MM/YYYY'));
  const [vencimento, setVencimento] = useState('');
  const [metodo, setMetodo] = useState('');

  const [openc, setopenc] = useState(false);
  const [openv, setopenv] = useState(false);

  // METODO PARA OBTER OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await getClientes();
        const seriesResponse = await getSeries();
        const artigosResponse = await getArtigos();
        const metodosResponse = await getMetodos();

        if (clientesResponse.data) {
          setDadosClientes(clientesResponse.data);
        }

        if (seriesResponse.data) {
          setDadosSeries(seriesResponse.data);
        }

        if (artigosResponse.data) {
          setDadosArtigos(artigosResponse.data);
        }
        if (metodosResponse.data) {
          setDadosMetodo(metodosResponse.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // METODO EXECUTADO QUANDO O BOTÃO DE CRIAR FATURA É PRESSIONADO
  // ENVIA OS DADOS PARA A API
  const handleCreateFatura = () => {
    // Define the variables here
    const clienteC = cliente;
    const serieC = serie;
    const numeroC = 0;
    const dataC = dataIni; // está undifined
    const validadeC = dataVal; // está undifined
    const dueDateC = vencimento;
    const referenciaC = ref; 
    const moedaC = moeda;
    const descontoC = desc;
    const observacoesC = obs;
    // const LinhasC = linha;
    const metodoC = metodo;
    const finalizarDocumentoC = finalizarDoc;
  
    CriarFatura(
      clienteC,
      serieC,
      numeroC,
      dataC,
      validadeC,
      dueDateC,
      referenciaC,
      moedaC,
      descontoC,
      observacoesC,
    //   // LinhasC,
      metodoC,
      finalizarDocumentoC,
    ).then(response => {
      console.log(clienteC, serieC, numeroC, dataC, validadeC, dueDateC, referenciaC, moedaC, descontoC, observacoesC, metodoC, finalizarDocumentoC);
      console.log(response + ' Resposta Criar Fatura');
    //   // navigation.navigate('GesFaturação');
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

          {/* date - DONE */}
          <Text style={styles.titleSelect}>Data</Text>
          <View style={styles.borderMargin}>
            <TouchableOpacity onPress={() => setopenc(true)} style={styles.touchableO}>
            <DatePicker
              modal 
              mode="date"
              open={openc}
              date={new Date(moment(dataIni, 'DD/MM/YYYY').format())}
              minimumDate={new Date()}
              onConfirm={date => {
                setopenc(false);
                if (moment(date).isBefore(moment(dataVal, 'DD/MM/YYYY'))) {
                  setDataIni(moment(date).format('DD/MM/YYYY'));
                } else {
                  ToastAndroid.show('Data de inicio não pode ser após a data de validade', ToastAndroid.SHORT);
                }
              }}
              onCancel={() => setopenc(false)}
            />
            <Text style={styles.textDate}> {' '} {dataIni}</Text>
            </TouchableOpacity>
          </View>

          {/* expiration - DONE */}
          <Text style={styles.titleSelect}>Validade</Text>
          <View style={styles.borderMargin}>
            <TouchableOpacity onPress={() => setopenv(true)} style={styles.touchableO}>
            <DatePicker
              modal 
              mode="date"
              open={openv}
              date={new Date(moment(dataVal, 'DD/MM/YYYY').format())}
              minimumDate={new Date()}
              onConfirm={date => {
                setopenv(false);
                if (moment(date).isAfter(moment(dataIni, 'DD/MM/YYYY'))) {
                  setDataVal(moment(date).format('DD/MM/YYYY'));
                  const vencimentoEmDias = moment(date).diff(moment(dataIni, 'DD/MM/YYYY'), 'days');
                  setVencimento(vencimentoEmDias);
                } else {
                  ToastAndroid.show('Data de validade não pode ser anterior à data de inicio', ToastAndroid.SHORT);
                }
              }}
              onCancel={() => setopenv(false)}
            />
              <Text style={styles.textDate}> {' '} {dataVal}</Text>
            </TouchableOpacity>
          </View>

          {/* reference - DONE */}
          <Text style={styles.titleSelect}>Referencia</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={ref}
              onChangeText={text => setReferencia(text)}
              placeholder="Referencia"
            />
          </View>

          {/* Coin - DONE */}
          <Text style={styles.titleSelect}>Moeda</Text>
          <View style={styles.borderMargin}>
            <Picker
              selectedValue={moeda}
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

          {/* discount - DONE */}
          <Text style={styles.titleSelect}>Desconto</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={desc}
              onChangeText={text => setDesconto(text)}
              placeholder="Desconto"
              keyboardType="numeric"
            />
          </View>

          {/* observations - DONE */}
          <Text style={styles.titleSelect}>Observações</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={obs}
              onChangeText={text => setObservacao(text)}
              placeholder="Observações"
            />
          </View>

          {/* finalize - DONE */}
          <Text style={styles.titleSelect}>Finalize</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              placeholder="Finalizado"
              selectedValue={finalizarDoc}
              onValueChange={itemValue => setFinalizarDocumento(itemValue)}
            >
              <Picker.Item label="Rascunho" value="0" />
              <Picker.Item label="Aberto" value="1" />
            </Picker>
          </View>

          {/* payment */}
          <Text style={styles.titleSelect}>Método de Pagamento</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              placeholder="Método de Pagamento"
              selectedValue={metodo}
              onValueChange={itemValue => {
              setSelectedIdMetodo(itemValue); 
              setMetodo(itemValue);}}
            >
              <Picker.Item label="Selecione um método de pagamento" value={null} />
              {dadosMetodo.map((metodo, i) => (
                <Picker.Item
                  label={metodo.name}
                  value={metodo.id.toString()}
                  key={i}
                />
              ))}
            </Picker>
          </View>

          {/* lines/artigos */}
          {/* Deve permitir selecionar vários artigos e as quantidades de cada */}
          <Text style={styles.titleSelect}>Artigos</Text>
          <View style={styles.borderMargin}>
              
          </View>

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

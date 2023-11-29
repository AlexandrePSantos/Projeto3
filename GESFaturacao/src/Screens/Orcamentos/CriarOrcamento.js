import React, {useState, useEffect, useContext} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  ScrollView,
  ToastAndroid,
  LogBox,
} from 'react-native';
import {AuthContext} from '../../Context/AuthContext';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment/moment';

export default function CriarOrcamento({navigation}) {
  const {getClientes} = useContext(AuthContext);
  const {CriarOrcamento} = useContext(AuthContext);
  const {getSeries} = useContext(AuthContext);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);

  const [referenciaC, setReferencia] = useState('');
  const [vencimentoC, setVencimento] = useState('');
  const [moedaC, setMoeda] = useState('1'); // Valor inicial '1' para 'Euro (€)'
  const [descontoC, setDesconto] = useState('0'); // Valor inicial '0'
  const [observacoesC, setObservacao] = useState('');
  const [finalizarDocumentoC, setFinalizarDocumento] = useState(0);
  const [datei, setDatei] = useState();

  const [clienteC, setCliente] = useState();
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [datev, setDatev] = useState(new Date());
  const [openv, setOpenV] = useState(false);

  // Dados para addOrçamento
  const [LinhasC, setLinhas] = useState([]);

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

  const [selectedDate, setSelectedDate] = useState(new Date());

  const openDateTimePicker = async () => {
    try {
      const {action, year, month, day} = await DateTimePickerAndroid.open({
        date: selectedDate,
        mode: 'spinner', // Set the mode according to your requirement
      });

      if (action !== DateTimePickerAndroid.dismissedAction) {
        // Do something with the selected date (year, month, day)
        const selected = new Date(year, month, day);
        setSelectedDate(selected);
      }
    } catch (error) {
      console.error('Error opening date picker: ', error);
    }
  };

  const onSubmit = data => {
    setLinhas([...LinhasC, data]);
  };

  const removeItem = index => {
    setLinhas(LinhasC.filter((_, i) => i !== index));
  };

  console.log(LinhasC);

  handleCreateOrcamento = () => {
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

    console.log(clienteC);
    CriarOrcamento(
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
      console.log(response + ' Resposta Criar Orçamento');
      navigation.navigate('GesFaturação');
      ToastAndroid.show('Orçamento Criado', ToastAndroid.SHORT);
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Cliente */}
        <View style={{marginTop: 10}}>
          <Text style={styles.titleSelect}>Client</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              placeholder="Selecione um cliente"
              selectedValue={selectedIdCliente}
              onValueChange={itemValue => {
                setSelectedIdCliente(itemValue);
                setCliente(itemValue);
              }}>
              {dadosClientes.map(function (client, i) {
                return (
                  <Picker.Item
                    label={client.name}
                    value={client.id.toString()}
                    key={i}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
        {/* SERIE */}
        <Text style={styles.titleSelect}>Series</Text>
        <View style={styles.borderMargin}>
          <Picker
            style={styles.pickerComponent}
            selectedValue={selectedIdSerie}
            onValueChange={itemValue => {
              setSelectedIdSerie(itemValue);
              setSerie(itemValue);
            }}>
            <Picker.Item label="Selecione uma serie" value={null} />
            {dadosSeries.map(function (serie, i) {
              return (
                <Picker.Item
                  label={serie.description}
                  value={serie.id.toString()}
                  key={i}
                />
              );
            })}
          </Picker>
        </View>

        {/* date */}
        <Text style={styles.titleSelect}>Data</Text>
        <View style={styles.borderMargin}>
          <TouchableOpacity
            onPress={() => setOpenV(true)}
            style={styles.touchableO}>
            <DatePicker
              modal
              mode="date"
              open={openv}
              date={new Date()}
              onConfirm={datev => {
                setOpenV(false);
                setDatev(datev);
                setValidade(moment(datev).format('DD/MM/YYYY'));
              }}
              onCancel={() => {
                setOpenV(false);
              }}
            />
            <Text style={styles.textDate}>
              {' '}
              {(todaiDate = moment(datei).format('DD/MM/YYYY'))}{' '}
            </Text>
          </TouchableOpacity>
        </View>

        {/* expiration */}
        <Text style={styles.titleSelect}>Validade</Text>
        <View>
          <Button title="Open Date Picker" onPress={openDateTimePicker} />
        </View>

        {/* Referencia */}
        <Text style={styles.titleSelect}>Referencia</Text>
        <View style={styles.borderMargin}>
          <TextInput
            style={styles.input}
            value={referenciaC}
            onChangeText={text => setReferencia(text)}
            placeholder="Referencia"
          />
        </View>

        {/* Vencimento */}
        <Text style={styles.titleSelect}>Vencimento</Text>
        <View style={styles.borderMargin}>
          <TextInput
            style={styles.input}
            value={vencimentoC}
            onChangeText={text => setVencimento(text)}
            placeholder="Vencimento"
            keyboardType="numeric"
          />
        </View>

        {/* Moeda */}
        <Text style={styles.titleSelect}>Moeda</Text>
        <View style={styles.borderMargin}>
          <Picker
            selectedValue={moedaC}
            onValueChange={itemValue => setMoeda(itemValue)}
            style={styles.pickerComponent}>
            <Picker.Item label="Euro (€)" value="1" />
            <Picker.Item label="Libra ING (GBP)" value="2" />
            <Picker.Item label="Dólar USA ($)" value="3" />
            <Picker.Item label="Real Br. (R$)" value="4" />
            <Picker.Item label="Fr. Suiço (CHF)" value="5" />
          </Picker>
        </View>

        {/* Desconto */}
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

        {/* Observações */}
        <Text style={styles.titleSelect}>Observações</Text>
        <View style={styles.borderMargin}>
          <TextInput
            style={styles.input}
            value={observacoesC}
            onChangeText={text => setObservacao(text)}
            placeholder="Observações"
          />
        </View>

        {/* Finalize */}
        <Text style={styles.titleSelect}>Finalize</Text>
        <View style={styles.borderMargin}>
          <Picker
            style={styles.pickerComponent}
            placeholder="Finalizado"
            selectedValue={finalizarDocumentoC}
            onValueChange={itemValue => setFinalizarDocumento(itemValue)}>
            <Picker.Item label="Rascunho" value="0" />
            <Picker.Item label="Aberto" value="1" />
          </Picker>
        </View>
        <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
          <Button
            title="Criar Orçamento"
            color="#d0933f"
            onPress={() => handleCreateOrcamento()}
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
    fontSize: 16,
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: 'grey',
  },
  touchableO: {
    width: 350,
    height: 55,
    justifyContent: 'center',
  },
  input: {
    width: 350,
    padding: 10,
  },
});

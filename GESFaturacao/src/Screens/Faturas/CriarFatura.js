import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  useColorScheme,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { AuthContext } from '../../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

function Item({ item, onPress, onDelete }) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8, borderBottomWidth: 1, borderColor: '#000'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
        <TouchableOpacity onPress={onPress}>
          <Text>
            {"ID: " + item.id + "\n" +
            "Artigo: " + item.description + "\n" +
            "Preço Un.: " + Number(item.price) + " €\n" +
            "QTD.: " + parseInt(item.quantity) + "\n" +
            "Total: " + Number(item.price) * Number(item.quantity) + " €"}
          </Text>
        </TouchableOpacity>
        <View style={{marginLeft: 10}}>
          <Button title="x" color="#bf4346" onPress={onDelete} />
        </View>
      </View>
    </View>
  );
}
const CustomButton = ({ title, onPress, styles, gradientColors }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={gradientColors}
      style={[styles.button]} // Make sure to access the button style from styles object
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function CriarFatura({ navigation }) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  // VARIAVEIS PARA OBTER OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO USADOS PARA CARREGAR ARRAYS DOS PICKERS
  const { CriarFatura } = useContext(AuthContext);
  const { enviarEmail } = useContext(AuthContext);
  const { getClientes } = useContext(AuthContext);
  const { getSeries } = useContext(AuthContext);
  const { getArtigos } = useContext(AuthContext);
  const { getMetodos } = useContext(AuthContext);
  const { getMoedas } = useContext(AuthContext);

  // ARRAYS PARA GUARDAR OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO MOSTRADOS NOS PICKERS
  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);
  const [dadosMetodo, setDadosMetodo] = useState([]);
  const [dadosArtigos, setDadosArtigos] = useState([]);
  const [dadosMoedas, setDadosMoedas] = useState([]);

  // VARIAVEIS PARA GUARDAR OS IDS DOS CLIENTES, SERIES, ARTIGOS E METODOS SELECIONADOS NOS PICKERS
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [selectedIdArtigo, setSelectedIdArtigo] = useState(null);
  const [selectedMetodo, setSelectedIdMetodo] = useState(null);
  const [selectedMoeda, setSelectedIdMoeda] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [artigo, setArtigo] = useState();
  const [quantidade, setQuantidade] = useState('Quantidade');
  const [listKey, setListKey] = useState(0);

  // VARIAVEIS PARA GUARDAR OS DADOS DA FATURA
  // SÃO USADOS PARA ENVIAR PARA A API
  const [ref, setReferencia] = useState('');
  const [moeda, setMoeda] = useState('1'); 
  const [desc, setDesconto] = useState('0'); 
  const [obs, setObservacao] = useState('');
  const [finalizarDoc, setFinalizarDocumento] = useState(0);
  const [cliente, setCliente] = useState();
  const [serie, setSerie] = useState();
  const [dataIni, setDataIni] = useState(moment().format('DD/MM/YYYY'));
  const [dataVal, setDataVal] = useState(moment().format('DD/MM/YYYY'));
  const [vencimento, setVencimento] = useState('1');
  const [metodo, setMetodo] = useState('');
  const [LinhasC, setLinhas] = useState([]);

  const [email, setEmail] = useState(''); 

  const [openc, setopenc] = useState(false);

  // METODO PARA OBTER OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesResponse = await getClientes();
        const seriesResponse = await getSeries();
        const artigosResponse = await getArtigos();
        const metodosResponse = await getMetodos();
        const moedasResponse = await getMoedas();

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
        if (moedasResponse.data) {
          setDadosMoedas(moedasResponse.data);
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

    if (!cliente || !serie || LinhasC.length === 0 || !dataIni) {
      let errorMessage = "Os seguintes campos são obrigatórios:\n";
      if (!cliente) errorMessage += "- Cliente\n";
      if (!serie) errorMessage += "- Série\n";
      if (LinhasC.length === 0) errorMessage += "- Selecione pelo menos um artigo\n";
      if (!dataIni) errorMessage += "- Data de início\n";
  
      Alert.alert('Campos Obrigatórios', errorMessage);
      return;
    }
    
    // Define the variables here
    const clienteC = cliente;
    const serieC = serie;
    const numeroC = 0;
    const dataC = dataIni; 
    const validadeC = dataVal; 
    const dueDateC = vencimento;
    const referenciaC = ref; 
    const moedaC = moeda;
    const descontoC = desc;
    const observacoesC = obs;
    const LinhaFinal = LinhasC;
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
      metodoC,
      LinhaFinal,
      finalizarDocumentoC,
    ).then(response => {
      navigation.navigate('Dashboard');
      ToastAndroid.show("Fatura Criada ", ToastAndroid.SHORT);
      if (finalizarDoc == 1) {
        const documentId = response.fatura;
        enviarEmail(email, "FT", documentId)
          .then(() => {
            console.log('Email enviado com sucesso!');
          })
          .catch(error => {
            console.error('Falha ao enviar email:', error);
          });
      }
    }).catch(error => {
      console.error('Error creating invoice:', error);
      ToastAndroid.show('Erro ao criar fatura', ToastAndroid.SHORT);
    });
  };

  function handleDeleteItem(index) {
    const newLinhasC = [...LinhasC];
    newLinhasC.splice(index, 1);
    setLinhas(newLinhasC);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{marginTop: 10}}>
          {/* Cliente - DONE */}
          <Text style={styles.titleSelect}>Cliente</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdCliente}
              onValueChange={itemValue => {
                setSelectedIdCliente(itemValue);
                setCliente(itemValue);
              }} >
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

          {/* Serie - DONE */}
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
                onConfirm={date => {
                  setopenc(false);
                  
                    setDataIni(moment(date).format('DD/MM/YYYY'));

                    const daysToAdd = {
                      '1': 0,   // Pago a Pronto
                      '2': 10,  // 10 Dias Após Emissão
                      '3': 20,  // 20 Dias Após Emissão
                      '4': 30,  // Add more conditions as needed
                      '5': 60,
                      '6': 75,
                      '7': 90,
                      '8': 120,
                      '9': 180,
                    }[vencimento];

                    const expirationDate = moment(date).add(daysToAdd, 'days');
                    setDataVal(expirationDate.format('DD/MM/YYYY'));
                  
                }}
                onCancel={() => setopenc(false)}
              />
              <Text style={styles.textDate}> {' '} {dataIni}</Text>
            </TouchableOpacity>
          </View>

          {/* expiration - DONE */}
          <Text style={styles.titleSelect}>Validade</Text>
          <View style={styles.borderMargin}>
            <View style={styles.touchableO}>
              <Text style={styles.textDate}> {' '} {dataVal}</Text>
            </View>
          </View>

          {/* condicoes - DONE */}
          <Text style={styles.titleSelect}>Condições de Pagamento</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={vencimento}
              onValueChange={itemValue => {
                setVencimento(itemValue);
                const daysToAdd = {
                  '1': 0,   
                  '2': 10,  
                  '3': 20,  
                  '4': 30,  
                  '5': 60,
                  '6': 75,
                  '7': 90,
                  '8': 120,
                  '9': 180,
                }[itemValue];

                const expirationDate = moment(dataIni, 'DD/MM/YYYY').add(daysToAdd, 'days');
                setDataVal(expirationDate.format('DD/MM/YYYY'));
              }}
            >
              <Picker.Item label="Pago a Pronto" value="1" />
              <Picker.Item label="10 Dias Após Emissão" value="2" />
              <Picker.Item label="20 Dias Após Emissão" value="3" />
              <Picker.Item label="30 Dias Após Emissão" value="4" />
              <Picker.Item label="60 Dias Após Emissão" value="5" />
              <Picker.Item label="75 Dias Após Emissão" value="6" />
              <Picker.Item label="90 Dias Após Emissão" value="7" />
              <Picker.Item label="120 Dias Após Emissão" value="8" />
              <Picker.Item label="180 Dias Após Emissão" value="9" />
            </Picker>
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
            selectedValue={selectedMoeda}
            onValueChange={itemValue => {
              setSelectedIdMoeda(itemValue);
              setMoeda(itemValue);
            }}
            style={styles.pickerComponent}
          >
            {dadosMoedas.map((moeda, i) => (
              <Picker.Item
                label={moeda.description}
                value={moeda.id.toString()}
                key={i}
              />
            ))}
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
          <Text style={styles.titleSelect}>Finalizar</Text>
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

          {/* Email - DONE */}
          {finalizarDoc === '1' && (
          <View style={styles.borderMargin}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={text => setEmail(text)}
                placeholder="Email"
              />  
          </View>
          )}

          {/* payment - DONE*/}
          <Text style={styles.titleSelect}>Método de Pagamento</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              placeholder="Método de Pagamento"
              selectedValue={metodo}
              onValueChange={itemValue => {
                setSelectedIdMetodo(itemValue); 
                setMetodo(itemValue);
              }} >
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

          <Text style={styles.titleSelect}>Artigo e Quantidade</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', ...styles.borderMargin}}>
            <Picker 
              style={{flex: 2, marginRight: 10}}
              placeholder="Selecione um Artigo"
              selectedValue={artigo} 
              onValueChange={(itemValue) => {
                setArtigo(itemValue);
                setSelectedIdArtigo(itemValue);
                setQuantidade('1');
              }} >
              <Picker.Item label="Selecione um artigo" value={null} />
              {dadosArtigos.map(function (object, i) {
                return <Picker.Item label={object.description} value={object} key={i} />;
              })}
            </Picker>
            <TextInput
              style={{flex: 1}}
              onChangeText={(text) => setQuantidade(text)}
              value={quantidade}
              placeholder="Quantidade"
              keyboardType="numeric"
            />
            </View>
                    
        <CustomButton 
          title="Adicionar" 
          onPress={() => {
            if (!artigo) {
              Alert.alert('Erro', 'Selecione um artigo');
              return;
            } else if (!quantidade || quantidade === '0') {
              Alert.alert('Erro', 'Indique a quantidade');
              return;
            } else {
              const existingItemIndex = LinhasC.findIndex(item => item.id === artigo.id.toString());

              if (existingItemIndex >= 0) {
                LinhasC[existingItemIndex].quantity = Number(LinhasC[existingItemIndex].quantity) + Number(quantidade);
                LinhasC[existingItemIndex].price = Number(LinhasC[existingItemIndex].price) + Number(artigo.price);
              } else {
                const newItem = { 
                  id: artigo.id.toString(), 
                  description: artigo.description, 
                  quantity: quantidade, 
                  price: artigo.price, 
                  discount: '0', 
                  tax: artigo.taxID, 
                  exemption: artigo.exemptionID.toString(), 
                  retention: 0 
                };
                LinhasC.push(newItem);
              }

              setLinhas([...LinhasC]);
              setListKey(listKey + 1);
              setArtigo(null); // Reset artigo
              setQuantidade(''); // Reset quantidade
            }
          }}
        
          gradientColors={['#ff8a2a', '#ffa500']}
        />


        <Text style={styles.titleSelect}>Linha de Artigos</Text>
        <View style={styles.borderMargin}>
          {LinhasC.length === 0 ? (
            <Text>Sem artigos selecionados</Text>
          ) : (
            LinhasC.map((item, index) => (
              <Item 
                key={index} 
                item={item} 
                onPress={() => {setSelectedItem(item); setModalVisible(true);}} 
                onDelete={() => handleDeleteItem(index)}
              />
            ))
          )}
        </View>
      </View>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.titleSelect}>Alterar quantidade</Text>
            <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              onChangeText={setQuantidade}
              value={quantidade}
              placeholder="Quantidade"
              keyboardType="numeric"
            />
            </View>
            <View style={styles.buttonModal}>
              <Button 
                color={'gray'}
                title="Confirmar" 
                onPress={() => {
                  const existingItemIndex = LinhasC.findIndex(item => item.id === selectedItem.id);

                  if (existingItemIndex >= 0) {
                    LinhasC[existingItemIndex].quantity = quantidade;
                  }

                  setLinhas([...LinhasC]);

                  setSelectedItem(null);
                  setQuantidade('');

                  setModalVisible(false);
                }}
              />
              </View>
              <View style={styles.buttonModal}>
              <Button 
                color={'gray'}
                title="Cancelar" 
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
        
      <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
          <CustomButton
            title="Criar Fatura"
            onPress={() => handleCreateFatura()}
            styles={styles}
            gradientColors={['#ff8a2a', '#ffa500']}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#d0933f',
    width: 350,
    padding: 10,
    borderRadius:10,
  },
    buttonText: {
    color: '#ffffff', // Letras brancas
    fontWeight: 'bold', // Negrito
    textAlign: 'center', // Centralizado
    fontSize: 20,
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#ffffff' : '#5F5D5C',
  },
  pickerComponent: {
    width: 350,
  },
  borderMargin: {
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#ffffff' : 'grey',
    marginBottom: 15,
    borderRadius: 7,
  },
  touchableO: {
    width: 350,
    height: 55,
    justifyContent: 'center',
  },
  buttonModal: {
    marginBottom: 10,
    backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#d0933f',
  },
  modalView: {
    width: 300,
    height: 250,
    margin: 20,
    backgroundColor: colorScheme === 'dark' ? '#333333' : 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: colorScheme === 'dark' ? '#ffffff' : 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add this line
  },
});

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
} from 'react-native';
import { AuthContext } from '../../Context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { ActivityIndicator } from 'react-native-paper';

function Item({ item, onPress }) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
      <Text style={{flex: 1}}>
        {"ID: " + item.id + "\n" +
        "Artigo: " + item.description + "\n" +
        "Preço Un.: " + Number(item.price) + " €\n" +
        "QTD.: " + item.quantity + "\n" +
        "Total: " + Number(item.price) * Number(item.quantity) + " €" +
        "\n-------------------------"}
      </Text>
      <View style={{marginLeft: 10}}><Button title="x" color="#bf4346" onPress={onPress} /></View>
    </View>
  );
}

export default function CriarOrcamento({ route, navigation }) {

  const [loading, setLoading] = useState(true);
  const { orcamentoId} = route.params;
  const { EditarOrcamento, enviarEmail, getOrcamentoById, getClientes, getSeries, getArtigos, getMetodos, getMoedas } = useContext(AuthContext); 
  // VARIAVEIS PARA OBTER OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO USADOS PARA CARREGAR ARRAYS DOS PICKERS


  // ARRAYS PARA GUARDAR OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO MOSTRADOS NOS PICKERS
  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);
  const [dadosArtigos, setDadosArtigos] = useState([]);
  const [dadosMetodo, setDadosMetodo] = useState([]);
  const [dadosMoedas, setDadosMoedas] = useState([]);

  // VARIAVEIS PARA GUARDAR OS IDS DOS CLIENTES, SERIES, ARTIGOS E METODOS SELECIONADOS NOS PICKERS
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [selectedIdArtigo, setSelectedIdArtigo] = useState(null);
  const [selectedMetodo, setSelectedIdMetodo] = useState(null);
  const [selectedMoeda, setSelectedIdMoeda] = useState(null);

  const [artigo, setArtigo] = useState();
  const [quantidade, setQuantidade] = useState('Quantidade');
  const [listKey, setListKey] = useState(0);

  // VARIAVEIS PARA GUARDAR OS DADOS DA FATURA
  // SÃO USADOS PARA ENVIAR PARA A API
  const [ref, setReferencia] = useState();
  const [moeda, setMoeda] = useState(); // Valor inicial '1' para 'Euro (€)'
  const [desc, setDesconto] = useState(); // Valor inicial '0'
  const [obs, setObservacao] = useState();
  const [finalizarDoc, setFinalizarDocumento] = useState('0');
  const [cliente, setCliente] = useState();
  const [serie, setSerie] = useState();
  const [dataIni, setDataIni] = useState(moment().format('DD/MM/YYYY'));
  const [dataVal, setDataVal] = useState(moment().format('DD/MM/YYYY'));
  const [vencimento, setVencimento] = useState();
  const [metodo, setMetodo] = useState();
  const [LinhasC, setLinhas] = useState([]);

  const [email, setEmail] = useState(''); // Email para enviar a fatura

  const [openc, setopenc] = useState(false);

  // METODO PARA OBTER OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  useEffect(() => {
    getOrcamentoById(orcamentoId).then(async fetchOrcamento => {
        if(fetchOrcamento && fetchOrcamento.data){
            const simplifiedOrcamento = fetchOrcamento.data;

            try{
                const metodosResponse = await getMetodos();
                if (metodosResponse.data){
                    setDadosMetodo(metodosResponse.data);
                }
                
                const metodoPagamento = fetchOrcamento.result.metodoPagamento;
                const selectedMethod = metodosResponse.data.find(method => method.name === metodoPagamento);
                const selectedValue = selectedMethod ? selectedMethod.id.toString() : null;

                setSelectedIdCliente(simplifiedOrcamento.client.id.toString());
                setCliente(simplifiedOrcamento.client.id.toString());
                setSelectedIdSerie(simplifiedOrcamento.serie.id.toString());
                setSerie(simplifiedOrcamento.serie.id.toString());
                setReferencia(simplifiedOrcamento.reference);
                setSelectedIdMoeda(simplifiedOrcamento.coin.id.toString());
                setMoeda(simplifiedOrcamento.coin.id.toString());
                setDesconto(simplifiedOrcamento.discount);
                setObservacao(simplifiedOrcamento.observations);
                setSelectedIdSerie(simplifiedOrcamento.serie.id.toString());
                setSerie(simplifiedOrcamento.serie.id.toString());
                setDataIni(simplifiedOrcamento.date);
                setDataVal(simplifiedOrcamento.expiration);
                setVencimento(simplifiedOrcamento.dueDate.toString());
                setSelectedIdMetodo(selectedValue);
                setMetodo(selectedValue);
                setFinalizarDocumento(simplifiedOrcamento.status === 'Aberto' ? '1' : '0');

                const transformedLines = simplifiedOrcamento. lines.map(line => ({
                    id: line.article.id.toString(),
                    description: line.article.name,
                    quantity: line.quantity.value,
                    price: line.price.value,
                    discount: line.percentageDiscount.value,
                    tax: line.tax.id.toString(),
                    exemption: line.exemption.id ? line.exemption.id.toString() : null,
                    retention: line.retention.value

                }));
                setLinhas(transformedLines);

                console.log('transformedLines: ', transformedLines);

                const clientesResponse = await getClientes();
                const seriesResponse = await getSeries();
                const artigosResponse = await getArtigos();
                const moedasResponse = await getMoedas();
                
                if(clientesResponse.data) {
                    setDadosClientes(clientesResponse.data);
                }
                if (seriesResponse.data) {
                    setDadosSeries(seriesResponse.data);
                }
                if(artigosResponse.data){
                    setDadosArtigos(artigosResponse.data);
                }
                if(moedasResponse.data){
                    setDadosMoedas(moedasResponse.data);
                }
            } catch(error){
                console.error(error);
            }
            setLoading(false);
        } else {
            console.error('Fetched Orçamento is undefined or does not contain data');
        }
    })
    .catch(error => {
        console.error('Error getting Orçamento: ', error);
    });
    /* 
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
    */
  }, [orcamentoId]);

  const removeItem = (index) => {
    setLinhas(LinhasC.filter((_, i) => i !== index));
  }

  const handleConfirmarEditar = () => {
    console.log('LinhasC: ', LinhasC);
    // Validation checks  
    EditarOrcamento(
      orcamentoId,
      cliente,
      serie,
      0,
      dataIni,
      dataVal,
      vencimento,
      ref,
      moeda,
      desc,
      obs,
      metodo,
      LinhasC,
      finalizarDoc,
    ).then(response => {
      navigation.navigate('Dashboard');
      ToastAndroid.show("Orçamento Criada ", ToastAndroid.SHORT);
      if (finalizarDoc == 1) {
        const documentId = response.orcamento;
        enviarEmail(email, "OR", documentId)
          .then(() => {
            console.log('Email sent successfully');
          })
          .catch(error => {
            console.error('Failed to send email:', error);
          });
      }
    }).catch(error => {
      console.error('Erro ao criar orçamento:', error);
      ToastAndroid.show('Erro ao criar orçamento', ToastAndroid.SHORT);
    });
  };
  
  const handleEditavel = () => {
    // TODO - Apenas são editáveis documentos com estado 0 "rascunho"
    // TODO - Botão que quando premido faz com que quando premido torna os campos editáveis e muda o texto do botão para "Cancelar"
    // TODO - Cancelar torna os campos não editáveis outra vez com os valores por defeito da API 
  }
  const calculateExpirationDate = (startDate, paymentCondition) => {
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
    }[paymentCondition];
  
    const expirationDate = moment(startDate, 'DD/MM/YYYY').add(daysToAdd, 'days');
    return expirationDate.format('DD/MM/YYYY');
  };

  if(loading){
    return(
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#d0933f" />
        </View>
    )
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
            <Button
            title="Editar"
            color="#d0933f"
            onPress={() => handleEditavel()}
            />
        </View>
        <View style={{marginTop: 10}}>

          {/* Cliente - DONE */}
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
                  // Validar se a data de início é antes da data de validade
                  
                    setDataIni(moment(date).format('DD/MM/YYYY'));

                    // Verificar a condição de pagamento e atualizar a data de validade
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
                  '1': 0,   // Pago a Pronto
                  '2': 10,  // 10 Dias Após Emissão
                  '3': 20,  // 20 Dias Após Emissão
                  '4': 30,  // Add more conditions as needed
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
              {/* Add more conditions of payment as needed */}
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

          {/* lines/artigos */}
          {/* Deve permitir selecionar vários artigos e as quantidades de cada */}
          <Text style={styles.titleSelect}>Artigo e Quantidade</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', ...styles.borderMargin}}>
            <Picker 
              style={{flex: 2, marginRight: 10}} // Add margin to the right of the Picker
              placeholder="Selecione um Artigo"
              selectedValue={artigo} 
              onValueChange={(itemValue, itemIndex) => {
                // console.log('Selected item:', itemValue);
                setArtigo(itemValue);
                setSelectedIdArtigo(itemValue);
                setQuantidade('1');
              }} >
              <Picker.Item label="Selecione artigo" value={null} />
              {dadosArtigos.map(function (object, i) {
                return <Picker.Item label={object.description} value={object} key={i}  />;
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
            <Button 
              title="Adicionar" 
              color="#d0933f" 
              onPress={() => {
                if (!artigo) {
                  Alert.alert('Erro', 'Selecione um artigo');
                  return;
                } else if (!quantidade || quantidade === '0') {
                  Alert.alert('Erro', 'Indique a quantidade');
                  return;
                } else {
                  // Check if item already exists in LinhasC
                  const existingItemIndex = LinhasC.findIndex(item => item.id === artigo.id.toString());

                  if (existingItemIndex >= 0) {
                    // If item exists, update its quantity and total
                    LinhasC[existingItemIndex].quantity = Number(LinhasC[existingItemIndex].quantity) + Number(quantidade);
                    LinhasC[existingItemIndex].price = Number(LinhasC[existingItemIndex].price) + Number(artigo.price);
                  } else {
                    // If item doesn't exist, add it as a new item
                    const newItem = { 
                      id: artigo.id.toString(), 
                      description: artigo.description, 
                      quantity: quantidade, 
                      price: Number(artigo.price).toFixed(2), 
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
            />

          <Text style={styles.titleSelect}>Linha de Artigos</Text>
          <View style={styles.borderMargin}>
            {LinhasC.length === 0 ? (
              <Text>Sem artigos selecionados</Text>
            ) : (
              LinhasC.map((item, index) => (
                <Item key={index} item={item} onPress={() => removeItem(index)} />
              ))
            )}
          </View>
        </View>
        
        <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
          <Button
            title="Confirmar"
            color="#d0933f"
            onPress={() => handleConfirmarEditar()}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
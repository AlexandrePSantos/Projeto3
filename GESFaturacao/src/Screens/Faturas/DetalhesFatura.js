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
  ActivityIndicator,
  ToastAndroid,
  useColorScheme,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment/moment';
import { AuthContext } from '../../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#bf4346',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
});

function Item({ item, onPress, onDelete }) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.itemText}>
            {"ID: " + item.id + "\n" +
            "Artigo: " + item.description + "\n" +
            "Preço Un.: " + parseFloat(item.price).toFixed(2) + " €\n" +
            "QTD.: " + parseInt(item.quantity) + "\n" +
            "Total: " + (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2) + " €"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>x</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default function DetalhesFatura({ route, navigation }) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  // Add a new state for loading
  const [loading, setLoading] = useState(true);
  const { faturaId } = route.params;
  const { EditarFatura, enviarEmail, getFaturasById, getClientes, getSeries, getArtigos, getMetodos, getMoedas} = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);

  // ARRAYS PARA GUARDAR OS DADOS DOS CLIENTES, SERIES, ARTIGOS E METODOS
  // SÃO MOSTRADOS NOS PICKERS
  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);
  const [dadosMetodo, setDadosMetodo] = useState([]);
  const [dadosArtigos, setDadosArtigos] = useState([]);
  const [dadosMoedas, setDadosMoedas] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // VARIAVEIS PARA GUARDAR OS IDS DOS CLIENTES, SERIES, ARTIGOS E METODOS SELECIONADOS NOS PICKERS
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [selectedIdArtigo, setSelectedIdArtigo] = useState(null);
  const [selectedMetodo, setSelectedIdMetodo] = useState(null);
  const [selectedMoeda, setSelectedIdMoeda] = useState(null);

  const [artigo, setArtigo] = useState();
  const [quantidade, setQuantidade] = useState();
  const [listKey, setListKey] = useState(0);

  // VARIAVEIS PARA GUARDAR OS DADOS DA FATURA
  // SÃO USADOS PARA ENVIAR PARA A API
  const [ref, setReferencia] = useState();
  const [moeda, setMoeda] = useState(); 
  const [desc, setDesconto] = useState(); 
  const [obs, setObservacao] = useState();
  const [finalizarDoc, setFinalizarDocumento] = useState('0');
  const [cliente, setCliente] = useState();
  const [serie, setSerie] = useState();
  const [dataIni, setDataIni] = useState(moment().format('DD/MM/YYYY'));
  const [dataVal, setDataVal] = useState(moment().format('DD/MM/YYYY'));
  const [vencimento, setVencimento] = useState();
  const [metodo, setMetodo] = useState();
  const [LinhasC, setLinhas] = useState([]);

  const [email, setEmail] = useState();

  const [openc, setopenc] = useState(false);

  useEffect(() => {
    getFaturasById(faturaId)
      .then(async fetchedFatura => {
        if (fetchedFatura && fetchedFatura.data) {
          const simplifiedFatura = fetchedFatura.data;
  
          try {
            const metodosResponse = await getMetodos();
            if (metodosResponse.data) {
              setDadosMetodo(metodosResponse.data);
            }
  
            const metodoPagamento = fetchedFatura.result.MetodoPagamento;
            const selectedMethod = metodosResponse.data.find(method => method.name === metodoPagamento);
            const selectedValue = selectedMethod ? selectedMethod.id.toString() : null;
  
            setSelectedIdCliente(simplifiedFatura.client.id.toString());
            setCliente(simplifiedFatura.client.id.toString());
            setSelectedIdSerie(simplifiedFatura.serie.id.toString());
            setSerie(simplifiedFatura.serie.id.toString());
            setReferencia(simplifiedFatura.reference);
            setSelectedIdMoeda(simplifiedFatura.coin.id.toString());
            setMoeda(simplifiedFatura.coin.id.toString());
            setDesconto(simplifiedFatura.discount);
            setObservacao(simplifiedFatura.observations);
            setSelectedIdSerie(simplifiedFatura.serie.id.toString());
            setSerie(simplifiedFatura.serie.id.toString());
            setDataIni(simplifiedFatura.date);
            setDataVal(simplifiedFatura.expiration);
            setVencimento(simplifiedFatura.dueDate.toString());
            setSelectedIdMetodo(selectedValue);
            setMetodo(selectedValue);
            setFinalizarDocumento(simplifiedFatura.status === 'Aberto' ? '1' : '0');
  
            const transformedLines = simplifiedFatura.lines.map(line => ({
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

            // Fetch the remaining data
            const clientesResponse = await getClientes();
            const seriesResponse = await getSeries();
            const artigosResponse = await getArtigos();
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
  
            if (moedasResponse.data) {
              setDadosMoedas(moedasResponse.data);
            }
          } catch (error) {
            console.error(error);
          }
  
          setLoading(false);
        } else {
          console.error('Fetched fatura is undefined or does not contain data');
        }
      })
      .catch(error => {
        console.error('Error getting fatura:', error);
      });
  }, [faturaId]);
  
  const handleConfirmarEditar = () => {
    console.log('LinhasC: ', LinhasC);
    EditarFatura(
      faturaId,
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
      ToastAndroid.show("Fatura Editada ", ToastAndroid.SHORT);
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
      console.error('Error editing invoice:', error);
      ToastAndroid.show('Erro ao editar fatura', ToastAndroid.SHORT);
    });
  };

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

  function handleDeleteItem(index) {
    const newLinhasC = [...LinhasC];
    newLinhasC.splice(index, 1);
    setLinhas(newLinhasC);
  }


  // Loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#ffffff' : '#d0933f'} />
      </View>
    );
  }

  const CustomButton = ({ title, onPress, styles, gradientColors }) => (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.button]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const CustomButtonModal = ({ title, onPress, styles, gradientColors }) => (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.buttonModal]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.modalText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
      {finalizarDoc === '0' && (
        <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
          {isEditing ? (
            <CustomButton
              title="Cancelar"
              onPress={() => setIsEditing(false)}
              styles={styles}
              gradientColors={['#ff0000', '#ffa500']}
            />
          ) : (
            <CustomButton
              title="Editar"
              onPress={() => setIsEditing(true)}
              styles={styles}
              gradientColors={['#ff8a2a', '#ffa500']}
            />
          )}
        </View>
    )}
    <View pointerEvents={isEditing ? 'auto' : 'none'} style={{marginTop: 10}}>

        {/* Cliente - DONE */}
        <Text style={styles.titleSelect}>Client</Text>
        <View style={styles.borderMargin}>
          <Picker 
            editable={isEditing}
            key={selectedIdCliente}
            style={styles.pickerComponent}
            selectedValue={selectedIdCliente}
            onValueChange={itemValue => { setSelectedIdCliente(itemValue); setCliente(itemValue); }} 
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
                setDataIni(moment(date).format('DD/MM/YYYY'));
                const expirationDate = calculateExpirationDate(date, vencimento);
                setDataVal(expirationDate);
              }}
              onCancel={() => setopenc(false)}
            />
            <Text style={styles.textDate}> {' '} {dataIni}</Text>
          </TouchableOpacity>
        </View>

        {/* expiration - DONE */}
        <Text style={styles.titleSelect}>Validade</Text>
        <View style={[styles.borderMargin,{backgroundColor: '#B3B6B7'}]}>
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
              const expirationDate = calculateExpirationDate(dataIni, itemValue);
              setDataVal(expirationDate);
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
            value={parseFloat(desc).toFixed(2)}
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
            selectedValue={selectedMetodo}
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

        {isEditing && (
          <>
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
            style={[{flex: 1}]}
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
                setArtigo(null); 
                setQuantidade('');
              }
            }}
            styles={styles}
            gradientColors={['#ff8a2a', '#ffa500']}
          />
          </>
          )}

        <Text style={styles.titleSelect}>Linha de Artigos</Text>
        <View style={styles.borderMargin}>
          {LinhasC.length === 0 ? (
            <Text style={styles.emptyText}>Sem artigos selecionados</Text>
          ) : (
            LinhasC.map((item, index) => (
              <Item 
                key={index} 
                item={item} 
                onPress={() => {setSelectedItem(item); setModalVisible(true);}} 
                onDelete={() => handleDeleteItem(index)}
                isEditing={isEditing}
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
              <Text style={styles.titleSelect}>Alterar Quantidade</Text>
              <View style={styles.borderMargin}>
              <TextInput
                style={[styles.input, { width: 100, textAlign: 'center' }]}
                onChangeText={setQuantidade}
                value={quantidade}
                placeholder="Quantidade"
                keyboardType="numeric"
              />
              </View>
              <View style={styles.buttonModal}>
                <CustomButtonModal 
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
                  styles={styles}
                  gradientColors={['#ff8a2a', '#ffa500']}
                />
                </View>
                <View style={styles.buttonModal}>
                <CustomButtonModal
                  styles={styles}
                  gradientColors={['#ff0000', '#ffa500']}
                  title="Cancelar" 
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
        </View>
      </Modal>
      
      {isEditing && (
          <>
      <View style={{marginTop: 10, marginBottom: 20, width: 350}}>
        <CustomButton
          title="Confirmar"
          onPress={() => handleConfirmarEditar()}
          styles={styles}
          gradientColors={['#ff8a2a', '#ffa500']}
        />
      </View>
      </>
      )}
    
      <View style={styles.overlay} pointerEvents="none" />
    
    </View>
    </ScrollView>
  );
}


const getStyles = (colorScheme) => StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add this line
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
    elevation: 5,
    borderRadius:10
  },
  modalText: {
    color: '#ffffff', // Letras brancas
    fontWeight: 'bold', // Negrito
    textAlign: 'center', // Centralizado
    fontSize: 15,
  },
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
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  buttonModal: {
    alignItems: 'center',
    width: 100,
    padding: 10,
    borderRadius:10,
  },
  emptyText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

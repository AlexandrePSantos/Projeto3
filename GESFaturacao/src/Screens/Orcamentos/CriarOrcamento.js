import React, { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput,ScrollView,ToastAndroid,LogBox  } from 'react-native';
import { AuthContext } from "../../Context/AuthContext";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment/moment';




export default function CriarOrcamento({ navigation }) {
  const { getClientes } = useContext(AuthContext);
  const { CriarOrcamento } = useContext(AuthContext);
  const { getSeries } = useContext(AuthContext);

  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosSeries, setDadosSeries] = useState([]);
  const [serieC, setSerie] = useState();
  const [datei, setDatei] = useState();

  const [clienteC, setCliente] = useState();
  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdSerie, setSelectedIdSerie] = useState(null);
  const [datev, setDatev] = useState(new Date());
  const [openv, setOpenV] = useState(false);

    //Dados para addOrçamento
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
      const { action, year, month, day } = await DateTimePickerAndroid.open({
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


  const onSubmit = (data) => {
    setLinhas([...LinhasC, data]);
  }

  
  const removeItem = (index) => {
    setLinhas(LinhasC.filter((_, i) => i !== index));
  }

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
    CriarOrcamento(clienteC, serieC, numeroC, dataC, validadeC, referenciaC, vencimentoC, moedaC, descontoC, observacoesC, LinhasC, finalizarDocumentoC).then(response => {
        console.log(response + ' Resposta Criar Orçamento')
        navigation.navigate("GesFaturação")
        ToastAndroid.show("Orçamento Criado", ToastAndroid.SHORT)
    });
}

 {/*
  return (
   
    <ScrollView>
    <View style={styles.container}>

      <View style={{marginTop: 10}}>
        <Text style={styles.titleSelect}>Cliente</Text>
        <View style={styles.borderMargin}>
          <Picker  style={styles.pickerComponent} placeholder="Selecione um cliente" selectedValue={selectedIdCliente} onValueChange={itemValue => {
            setSelectedIdCliente(itemValue); 
            setCliente(itemValue);}}>
            {dadosClientes.map(function (client, i) {
              return <Picker.Item label={client.value} value={client.id.toString()} key={i} />;
            })}
          </Picker>
        </View>

        <Text style={styles.titleSelect}>Serie</Text>
        <View style={styles.borderMargin}>
        <Picker
          selectedValue={serieC}
          onValueChange={(itemValue) => setSerie(itemValue)}
        >

          <Picker.Item label="2022" value="3" />
          <Picker.Item label="2023A" value="6" />
        </Picker>
        </View>

        <Text style={styles.titleSelect}>Data</Text>
        <View style={styles.borderMargin}>
        <TouchableOpacity  onPress={() => setOpen(true)} style={styles.touchableO}>
        <DatePicker
        modal
        mode="date"
        open={open}
        date={new Date()}
        onConfirm={(datei) => {
          setOpen(false)
          
          setDatei(datei);
          setData(moment(datei).format("DD/MM/YYYY"));
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      
      <Text style={styles.textDate}> {todaiDate = moment(datei).format("DD/MM/YYYY") }</Text>

      </TouchableOpacity>
      </View>

      <Text style={styles.titleSelect}>Validade</Text>
        <View style={styles.borderMargin}>
        <TouchableOpacity  onPress={() => setOpenV(true)} style={styles.touchableO}>
        <DatePicker
        modal
        mode="date"
        open={openv}
        date={new Date()}
        onConfirm={(datev) => {
          setOpenV(false)
          
          setDatev(datev);
          setValidade(moment(datev).format("DD/MM/YYYY"))
        }}
        onCancel={() => {
          setOpenV(false)
        }}
      />
      
      <Text style={styles.textDate}> {todayVDate = moment(datev).format("DD/MM/YYYY") }</Text>
         
      </TouchableOpacity>
      </View>

      <Text style={styles.titleSelect}>Referencia</Text>
        <View style={styles.borderMargin}>
        <TextInput
          value={referenciaC}
          onChangeText={(text) => setReferencia(text)}
          placeholder="Referencia"
          keyboardType="default"
        // ref={register({name: "quantidade"})} 
        />
        </View>

        <Text style={styles.titleSelect}>Vencimento</Text>
        <View style={styles.borderMargin}>
        <TextInput
          value={vencimentoC}
          onChangeText={(text) => setVencimento(text)}
          placeholder="Vencimento"
          keyboardType="numeric"
        // ref={register({name: "quantidade"})} 
        />
        </View>

        <Text style={styles.titleSelect}>Moeda</Text>
        <View style={styles.borderMargin}>
        <Picker
          selectedValue={moedaC}
          onValueChange={(itemValue) => setMoeda(itemValue)}
        >

          <Picker.Item label="Euro (€)" value="1" />
          <Picker.Item label="Libra ING (GBP)" value="2" />
          <Picker.Item label="Dólar USA ($)" value="3" />
          <Picker.Item label="Real Br. (R$)" value="4" />
          <Picker.Item label="Fr. Suiço (CHF)" value="5" />
        </Picker>
        </View>

        <Text style={styles.titleSelect}>Desconto</Text>
        <View style={styles.borderMargin}>
        <TextInput
          value={descontoC}
          defaultValue={0}
          onChangeText={(text) => setDesconto(text)}
          placeholder="Desconto"
          keyboardType="numeric"
        // ref={register({name:"preco"})}
        />
        </View>

        <Text style={styles.titleSelect}>Observações</Text>
        <View style={styles.borderMargin}>
        <TextInput
          value={observacoesC}
          onChangeText={(text) => setObservacoes(text)}
          placeholder="Observações"
          keyboardType="default"
        // ref={register({name: "quantidade"})} 
        />
        </View>

        <Text style={styles.titleSelect}>Artigo</Text>
        <View style={styles.borderMargin}>
        <Picker placeholder="Selecione um Artigo"
          selectedValue={artigo} onValueChange={itemValue => {
            setArtigo(itemValue);
            setSelectedIdArtigo(itemValue[0]);
            setPrecoPVP(itemValue[4]);
            setDescricaoL(itemValue[1]);
          }} >
          {dadosArtigos.map(function (object, i) {
            return <Picker.Item label={object[1]} value={object} key={i} />;
          })}
        </Picker>
        </View>
        //{/* {errors.artigo && <Text>{errors.artigo.message}</Text>} */}
        {/*
        <Text style={styles.titleSelect}>Quantidade</Text>
        <View style={styles.borderMargin}>
        <TextInput
          value={quantidade}
          onChangeText={(text) => setQuantidade(text)}
          placeholder="Quantidade"
          keyboardType="numeric"
        // ref={register({name: "quantidade"})} 
        />
        </View>
        */}
        {/* {errors.quantidade && <Text>{errors.quantidade.message}</Text>} */}
        {/*
        <Text style={styles.titleSelect}>Preço</Text>
        <View style={styles.borderMargin}>
        <TextInput
          value={precoPVP}
          defaultValue={precoPVP}
          onChangeText={(text) => setPrecoPVP(text)}
          placeholder="Preço Unitário"
          keyboardType="numeric"
        // ref={register({name:"preco"})}
        />
        </View>
        <Text style={styles.titleSelect}>Imposto</Text>
        <View style={styles.borderMargin}>
        <Picker
          selectedValue={iva}
          onValueChange={(itemValue) => setIva(itemValue)}
        >

          <Picker.Item label="23%" value="1" />
          <Picker.Item label="13%" value="2" />
          <Picker.Item label="6%" value="3" />
          <Picker.Item label="0%" value="4" />
        </Picker>
        </View>
        
        {/* {errors.preco && <Text>{errors.preco.message}</Text>} */}
        {/*
        <View style={{marginBottom: 10, marginTop: 10}}>
        <Button title="Adicionar" color="#d0933f" onPress={() => {
          setLinhas([...LinhasC, {
            artigo: selectedIdArtigo, descricao: descricaoC, qtd: quantidade, preco: precoPVP, imposto: iva, motivo: null, desconto: descontoC, retencao: retencaoC
          }]);
          setListKey(listKey + 1);
        }}
        />
        </View>

        <Text style={styles.titleSelect}>Finalizar Documento</Text>
        <View style={styles.borderMargin}>
        <Picker
          selectedValue={finalizarDocumentoC}
          onValueChange={(itemValue) => setFinalizarDocumento(itemValue)}
        >

          <Picker.Item label="Rascunho" value="0" />
          <Picker.Item label="Aberto" value="1" />
        </Picker>
        </View>
        
      </View>

      <Text style={styles.titleSelect}>Linha de Artigos</Text>
      <FlatList
        data={LinhasC}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Item item={item} onPress={() => removeItem(index)} />
        )}
      />
      <View style={{marginTop: 30,marginBottom: 10 ,width: 350}}>
      <Button  title="Criar Orçamento" color="#d0933f" onPress={() => handleCreateOrcamento()} />
      </View>
      </View>
    </ScrollView>
  );
        

}*/}
  return (
    <ScrollView>
    <View style={styles.container}>
      {/* Cliente */}
      <View style={{marginTop: 10}}>
        <Text style={styles.titleSelect}>Client</Text>
          <View style={styles.borderMargin}>
            <Picker  style={styles.pickerComponent} placeholder="Selecione um cliente" selectedValue={selectedIdCliente} 
              onValueChange={itemValue => {
              setSelectedIdCliente(itemValue);
              setCliente(itemValue);
            }}>
            {dadosClientes.map(function (client, i) {
              return <Picker.Item label={client.name} value={client.id.toString()} key={i} />;
            })}
            </Picker>
          </View>
        </View>
        {/* SERIE */}
        <Text style={styles.titleSelect}>Series</Text>
          <View style={styles.borderMargin}>
            <Picker style={styles.pickerComponent} selectedValue={selectedIdSerie} onValueChange={itemValue => {setSelectedIdSerie(itemValue); setSerie(itemValue)}} >
              <Picker.Item label="Selecione uma serie" value={null} />
                {dadosSeries.map(function (serie, i) { return <Picker.Item label={serie.description} value={serie.id.toString()} key={i} />; })}
            </Picker>
          </View>

          {/* date */}
          <Text style={styles.titleSelect}>Data</Text>
            <View style={styles.borderMargin}>
              <TouchableOpacity  onPress={() => setOpenV(true)} style={styles.touchableO}>
                <DatePicker modal mode="date" open={openv} date={new Date()}
                  onConfirm={(datev) => { setOpenV(false); setDatev(datev); setValidade(moment(datev).format("DD/MM/YYYY")) }} onCancel={() => { setOpenV(false) }} />
                <Text style={styles.textDate}> {todaiDate = moment(datei).format("DD/MM/YYYY") }</Text>
              </TouchableOpacity>
            </View>
          {/* expiration */}
          <Text style={styles.titleSelect}>Validade</Text>
          <View>
            <Button title="Open Date Picker" onPress={openDateTimePicker} />
          </View>
            {/* <View style={styles.borderMargin}>
              <TouchableOpacity  onPress={() => setOpenV(true)} style={styles.touchableO}>
                <DatePicker modal mode="date" open={openv} date={new Date()}
                  onConfirm={(datev) => { setOpenV(false); setDatev(datev); setValidade(moment(datev).format("DD/MM/YYYY")) }} onCancel={() => { setOpenV(false) }} />
                <Text style={styles.textDate}> {todayVDate = moment(datev).format("DD/MM/YYYY") }</Text>
              </TouchableOpacity>
            </View> */}

        <View style={{marginTop: 30,marginBottom: 10 ,width: 350}}>
          <Button  title="Criar Orçamento" color="#d0933f" onPress={() => handleCreateOrcamento()} />
        </View>
      </View> 
    </ScrollView>
  )
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


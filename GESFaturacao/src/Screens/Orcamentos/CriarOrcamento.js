import React from "react";
import { useState, useEffect, useContext } from 'react';
import { Button, StyleSheet, Text, Touchable, TouchableNativeFeedback, TouchableOpacity, View, FlatList, TextInput,ScrollView } from 'react-native';
import { AuthContext } from "../../Context/AuthContext";
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../../config';
import DatePicker from 'react-native-date-picker'
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';



function Item({ item, onPress }) {
  const {getArtigoID} = useContext(AuthContext);
  const [nomeArtigo, setNomeArtigo] = useState();
  getArtigoID(item.artigo).then((res)=>{
    setNomeArtigo(res.data.data.Nome)
  })
  return (
    <View style={{marginTop: 8}}>
      <Text>Artigo: {nomeArtigo} | Preço: {Number(item.preco)} € | QTD: {item.qtd} | Total: {Number(item.preco) * Number(item.qtd)} €</Text>
      <View style={{marginTop: 4}}><Button title="Remover" color="#bf4346" onPress={onPress} /></View>
    </View>
  );
}


export default function CriarOrcamento({ navigation }) {

  const { getOrcamentos } = useContext(AuthContext);
  const { getClientes } = useContext(AuthContext);
  const { getclienteID } = useContext(AuthContext)
  const { getArtigos } = useContext(AuthContext);
  const {addOrcamentos} = useContext(AuthContext);
  var coisa;

  /*const {register, handleSubmit, errors} = useForm({
    resolver: yupResolver(schema)
  });*/
  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosArtigos, setDadosArtigos] = useState([]);
  //const [cliente, setCliente] = useState();
  //const [linhas, setLinhas] = useState([]);
  const [datei, setDatei] = useState();
  const [open, setOpen] = useState(false);

  const [datev, setDatev] = useState();
  const [openv, setOpenV] = useState(false);

  const [artigo, setArtigo] = useState();
  const [quantidade, setQuantidade] = useState();
  const [preco, setPreco] = useState();
  const [listKey, setListKey] = useState(0);
  const [precoPVP, setPrecoPVP] = useState();
  const [iva, setIva] = useState(1);
  

    //Dados para addOrçamento

    const [clienteC, setCliente] = useState();
    const [serieC, setSerie] = useState(3);
    const [numeroC, setNumero] = useState(0);
    const [dataC, setData] = useState("12/12/2022");
    const [validadeC, setValidade] = useState("12/12/2022");
    const [referenciaC, setReferencia] = useState("Ref. Documento");
    const [vencimentoC, setVencimento] = useState(0);
    const [moedaC, setMoeda] = useState(1);
    const [descontoC, setDesconto] = useState(0);
    const [observacoesC, setObservacoes] = useState("Observacoes");
    //Linha de artigo
    //const [artigoC, setArtigoL ] = useState("1");
    const [descricaoC, setDescricaoL ] = useState("Artigo+Geral");
    //const [qtdC, setQtdL ] = useState("1");
    //const [precoC, setPrecoL ] = useState("33.333");
    //const [impostoC, setImpostoL ] = useState("1");
    //const [motivoC, setMotivoL ] = useState(null);
    //const [descontoCL, setDescontoL ] = useState("0");
    const [retencaoC, setRetencaoL ] = useState("0");
    //const [centroC, setCentroL ] = useState("5");
    //const [comentarioC, setComentarioL ] = useState("");
    
    const [LinhasC, setLinhas] = useState([]);
    const [finalizarDocumentoC, setFinalizarDocumento] = useState(0);


  const onSubmit = (data) => {
    setLinhas([...LinhasC, data]);
  }

  if (!dadosArtigos.length) {
    getArtigos().then((res) => {
      setDadosArtigos(res.data.aaData)
      console.log(res.data.aaData)
    });
  }
  if (!dadosClientes.length) {
    getClientes().then((res) => {
      console.log(res.data)
      setDadosClientes(res.data.aaData)
      
    });
    getOrcamentos().then((res) => {
      console.log(res.data);

    })
  }
  
  const removeItem = (index) => {
    setLinhas(LinhasC.filter((_, i) => i !== index));
  }

  console.log(LinhasC);

  const [selectedIdCliente, setSelectedIdCliente] = useState(null);
  const [selectedIdArtigo, setSelectedIdArtigo] = useState(null);

  handleCreateOrcamento = () => {

    console.log(clienteC + ' É aqui cepo');
    addOrcamentos(clienteC, serieC, numeroC, dataC, validadeC, referenciaC, vencimentoC, moedaC, descontoC, observacoesC, LinhasC, finalizarDocumentoC).then(response => {
        console.log(response + ' Resposta Criar Orçamento')
        navigation.navigate("GesFaturação")
    });
}

  return (
    <ScrollView>
    <View style={styles.container}>

      <View style={{marginTop: 10}}>
        <Button  title="Novo Cliente" color="#d0933f" onPress={() => navigation.navigate("GesFaturação - Criar Cliente")} />
        <Text style={styles.titleSelect}>Cliente</Text>
        <View style={styles.borderMargin}>
        <Picker  style={styles.pickerComponent} placeholder="Selecione um cliente" selectedValue={selectedIdCliente} onValueChange={itemValue => {
          setSelectedIdCliente(itemValue); 
          setCliente(itemValue[0]);}}>
          {dadosClientes.map(function (object, i) {
            return <Picker.Item label={object[2]} value={object[0]} key={i} />;
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
        {/* {errors.artigo && <Text>{errors.artigo.message}</Text>} */}
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
        {/* {errors.quantidade && <Text>{errors.quantidade.message}</Text>} */}
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


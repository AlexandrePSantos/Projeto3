import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  ToastAndroid,
  useColorScheme,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import {AuthContext} from '../../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

export default function CriarArtigo({navigation}) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const {CriarArtigo} = useContext(AuthContext);

  const {getCategorias} = useContext(AuthContext);
  const [dadosCategorias, setDadosCategorias] = useState([]);
  const [selectedIdCategory, setSelectedIdCategory] = useState(null);
  const [category, setCategory] = useState(null);

  const {getIVA} = useContext(AuthContext);
  const [dadosIvas, setDadosIvas] = useState([]);
  const [selectedIdIva, setSelectedIdIva] = useState(null);
  const [iva, setIva] = useState(null);

  const [code, setCode] = useState();
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [unit, setUnit] = useState();
  const [qtdStock, setQtdStock] = useState();
  const [qtdStockMin, setQtdStockMin] = useState();
  const [pvp, setPvp] = useState();
  const [precoUnit, setPrecoUnit] = useState();
  const [precoIni, setPrecoIni] = useState();
  const [stockMin, setStockMin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const categoryResponse = await getCategorias();
      const ivaResponse = await getIVA();

      if (categoryResponse.data) {
        setDadosCategorias(categoryResponse.data);
      }
      if (ivaResponse.data) {
        setDadosIvas(ivaResponse.data);
      }

    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
  }, []);

  const handleCreateArtigo = async () => {
    // Validation checks
    if (!code || !name || !type || !unit || !pvp || !iva) {
      let errorMessage = "Os seguintes campos são obrigatórios:\n";
      if (!code) errorMessage += "- Código\n";
      if (!name) errorMessage += "- Nome\n";
      if (!type) errorMessage += "- Tipo\n";
      if (!unit) errorMessage += "- Unidade\n";
      if (!pvp) errorMessage += "- Pvp\n";
      if (!iva) errorMessage += "- Iva\n";
  
      Alert.alert('Campos Obrigatórios', errorMessage);
      return;
    }
  
    const codeC = code;
    const nameC = name;
    const typeC = type;
    const unitC = unit;
    const qtdStockC = qtdStock;
    const qtdStockMinC = qtdStockMin;
    const stockMinC = stockMin;
    const pvpC = pvp;
    const precoUnitC = precoUnit;
    const precoIniC = precoIni;
    const ivaC = iva;
    const categoryC = category; 
  
    CriarArtigo(
      codeC,
      nameC,
      typeC,
      unitC,
      qtdStockC,
      qtdStockMinC,
      stockMinC,
      pvpC,
      precoUnitC,
      precoIniC,
      ivaC,
      categoryC,
    ).then(response => {
      navigation.navigate('Dashboard');
      ToastAndroid.show("Artigo Criada ", ToastAndroid.SHORT);
    }).catch(error => {
      console.error('Erro ao criar Artigo:', error);
      ToastAndroid.show('Erro ao criar Artigo', ToastAndroid.SHORT);
    }); 
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

  return (
    <ScrollView>
      <View style={styles.container}>
      <View style={{marginTop: 10}}>
        {/* Código - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Código</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={text => setCode(text)}
              placeholder="Código"
            />
          </View>
        
        {/* Nome - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Nome</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={text => setName(text)}
              placeholder="Nome"
            />
          </View>

        {/* Categoria - Opcional - Picker (getCategorias) */}
        <Text style={styles.titleSelect}>Categoria</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdCategory}
              onValueChange={itemValue => { setSelectedIdCategory(itemValue); setCategory(itemValue); }} >
              <Picker.Item label="Selecione uma categoria" value={null} />
                  {dadosCategorias.map((categoria, i) => (
                    <Picker.Item label={categoria.name} value={categoria.id.toString()} key={i} />
                  ))}
            </Picker>
          </View>

        {/* Tipo - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Tipo</Text>
          <View style={styles.borderMargin}>
            <Picker selectedValue={type} onValueChange={itemValue => setType(itemValue)} style={styles.pickerComponent} >
              <Picker.Item label="Selecione um tipo" value={null} />
              <Picker.Item label="Produto" value="P" />
              <Picker.Item label="Serviço" value="S" />
            </Picker>
          </View>

        {/* Un. medida - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Unidade de medida</Text>
          <View style={styles.borderMargin}>
            <Picker selectedValue={unit} onValueChange={itemValue => setUnit(itemValue)} style={styles.pickerComponent} >
              <Picker.Item label="Selecione uma unidade de medida" value="0" />
              <Picker.Item label="KG" value="1" />
              <Picker.Item label="Metro" value="2" />
              <Picker.Item label="Metro Quadrado" value="3" />
              <Picker.Item label="Litro" value="4" />
            </Picker>
          </View>
        {/* Qtd. Stock - Opcional - TextInput Numeric */}
        <Text style={styles.titleSelect}>QTD. Stock</Text>
        <View style={styles.borderMargin}>
          <TextInput
            style={styles.input}
            value={qtdStock}
            onChangeText={text => setQtdStock(text)}
            placeholder="QTD. Stock"
            keyboardType="numeric"
          />
        </View>

        {/* Stock Min.? - Opcional (Checkbox) */}
        <Text style={styles.titleSelect}>Stock Mínimo?</Text>
        <View>
          <CheckBox
            value={stockMin === 1}
            onValueChange={newValue => setStockMin(newValue ? 1 : 0)}
          />
        </View>

        {/* Qtd. Stock Min. - Opcional - TextInput Numeric */}
        {stockMin === 1 && (
          <View>
            <Text style={styles.titleSelect}>QTD. Stock Min.</Text>
            <View style={styles.borderMargin}>
              <TextInput
                style={styles.input}
                value={qtdStockMin}
                onChangeText={text => setQtdStockMin(text)}
                placeholder="Quantidade Stock Min."
                keyboardType="numeric"
              />
            </View>
          </View>
        )}



        {/* pvp - Obrigatório - TextInput Numeric */}
        <Text style={styles.titleSelect}>PVP</Text>
          <View style={styles.borderMargin}>
          <TextInput
              style={styles.input}
              value={pvp}
              onChangeText={text => setPvp(text)}
              placeholder="Preço PVP"
              keyboardType="numeric"
            />
          </View>

        {/* iva - Obrigatório - TextInput Numeric */}
        <Text style={styles.titleSelect}>IVA</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdIva}
              onValueChange={itemValue => { setSelectedIdIva(itemValue); setIva(itemValue); }} >
              <Picker.Item label="Selecione uma taxa" value={null} />
                  {dadosIvas.map((tax, i) => (
                    <Picker.Item label={`${tax.label}`} value={tax.id.toString()} key={i} />
                  ))}
            </Picker>
          </View>

        {/* Preço Unitário - Opcional - TextInput Numeric */}
        <Text style={styles.titleSelect}>Preço Unit.</Text>
          <View style={styles.borderMargin}>
          <TextInput
              style={styles.input}
              value={precoUnit}
              onChangeText={text => setPrecoUnit(text)}
              placeholder="Preço Unitário"
              keyboardType="numeric"
            />
          </View>

        {/* Preço de custo inicial - Opcional - TextInput Numeric */}
        <Text style={styles.titleSelect}>Preço de Custo Inicial</Text>
          <View style={styles.borderMargin}>
          <TextInput
              style={styles.input}
              value={precoIni}
              onChangeText={text => setPrecoIni(text)}
              placeholder="Preço de Custo Inicial"
              keyboardType="numeric"
            />
          </View>
      </View>
      <View style={{marginTop: 10, marginBottom: 20, width: 350}}>
          <CustomButton
            title="Criar Artigo"
            color="#d0933f"
            onPress={() => handleCreateArtigo()}
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
});


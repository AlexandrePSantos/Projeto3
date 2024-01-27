import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  Alert,
  ToastAndroid,
  useColorScheme,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import {AuthContext} from '../../Context/AuthContext';

export default function CriarCliente({navigation}) {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    const {CriarCliente, getCidade, getRegiao} = useContext(AuthContext);

    const [name, setName] = useState(); // textinput
    const [vat, setVat] = useState(); // textinput
    const [country, setCountry] = useState(); // picker
    const [address, setAddress] = useState(); // textinput
    const [postalCode, setPostalCode] = useState(); // textinput
    const [region, setRegion] = useState(); // picker
    const [city, setCity] = useState(); // picker
    const [email, setEmail] = useState(); // textinput
    const [website, setWebsite] = useState(); // textinput
    const [mobile, setMobile] = useState(); // textinput numeric
    const [telephone, setTelephone] = useState(); // textinput numeric
    const [fax, setFax] = useState(); // textinput numeric
    const [representativeName, setRepresentativeName] = useState(); // textinput
    const [representativeEmail, setRepresentativeEmail] = useState(); // textinput
    const [representativeMobile, setRepresentativeMobile] = useState(); // textinput numeric
    const [representativeTelephone, setRepresentativeTelephone] = useState(); // textinput numeric
    const [paymentMethod, setPaymentMethod] = useState(); // picker
    const [paymentCondition, setPaymentCondition] = useState(); // picker (dias)
    const [discount, setDiscount] = useState(); // textinput numeric
    const [accountType, setAccountType] = useState(); // radio unico (geral ou propria)
    const [internalCode, setInternalCode] = useState(); // textinput numeric

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

  const handleCreateCliente = async () => {
    CriarCliente(
        name, 
        vat, 
        country, 
        address,
        postalCode,
        region,
        city,
        email,
        website,
        mobile,
        telephone,
        fax,
        representativeName,
        representativeEmail,
        representativeMobile,
        representativeTelephone,
        paymentMethod,
        paymentCondition,
        discount,
        accountType,
        internalCode
    ).then(response => {
      navigation.navigate('Dashboard');
      ToastAndroid.show("Cliente Criado ", ToastAndroid.SHORT);
    }).catch(error => {
      console.error('Erro ao criar Cliente:', error);
      ToastAndroid.show('Erro ao criar Cliente', ToastAndroid.SHORT);
    }); 
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <View style={{marginTop: 10}}>

        {/* Código - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Código Interno</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={internalCode}
              onChangeText={text => setInternalCode(text)}
              placeholder="Código Interno"
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

        {/* VAT - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Vat</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={vat}
              onChangeText={text => setVat(text)}
              placeholder="vat"
            />
          </View>

        {/* Country - Picker (getPaises) */}
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
      <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
          <Button
            title="Criar Cliente"
            color="#d0933f"
            onPress={() => handleCreateCliente()}
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
    marginTop: 16,
    width: 300,
    padding: 10,
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


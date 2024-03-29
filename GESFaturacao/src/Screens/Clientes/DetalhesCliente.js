import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  ToastAndroid,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import {AuthContext} from '../../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

export default function DetalhesCliente({ route, navigation }) {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
  
    const [loading, setLoading] = useState(true);
    const { clienteId } = route.params;
    const { EditarCliente, getCidades, getRegioes, getMetodos, getPaises, getClientesById } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);

    const [dadosCidades, setDadosCidades] = useState([]);
    const [dadosRegioes, setDadosRegioes] = useState([]);
    const [dadosMetodosPagamento, setDadosMetodosPagamento] = useState([]);
    const [dadosPaises, setDadosPaises] = useState([]);

    const [name, setName] = useState(); // textinput
    const [vat, setVat] = useState(); // textinput
    const [country, setCountry] = useState(); // picker
    const [selectedIdCountry, setSelectedIdCountry] = useState();
    const [address, setAddress] = useState(); // textinput
    const [postalCode, setPostalCode] = useState(); // textinput
    const [region, setRegion] = useState(); // picker
    const [selectedIdRegion, setSelectedIdRegion] = useState(); // picker
    const [city, setCity] = useState(); // picker
    const [selectedIdCity, setSelectedIdCity] = useState(); // picker
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
    const [selectedIdPaymentMethod, setSelectedIdPaymentMethod] = useState(); // picker
    const [paymentCondition, setPaymentCondition] = useState(); // picker (dias)
    const [discount, setDiscount] = useState(); // textinput numeric
    const [accountType, setAccountType] = useState(); // radio unico (geral ou propria)
    const [internalCode, setInternalCode] = useState(); // textinput numeric

    useEffect(() => {
      getClientesById(clienteId)
        .then(async fetchedCliente => {
          if(fetchedCliente && fetchedCliente.data) {
            try {
              const responseCidades = await getCidades();
              setDadosCidades(responseCidades.data);
              const responseRegioes = await getRegioes();
              setDadosRegioes(responseRegioes.data);
              const responsePaises = await getPaises();
              setDadosPaises(responsePaises.data);
              const responseMetodos = await getMetodos();
              setDadosMetodosPagamento(responseMetodos.data);
            
              setName(fetchedCliente.data.name);
              setVat(fetchedCliente.data.vatNumber);
              setAddress(fetchedCliente.data.address);
              setPostalCode(fetchedCliente.data.postalCode);
              setEmail(fetchedCliente.data.email);
              setWebsite(fetchedCliente.data.website);
              setMobile(fetchedCliente.data.mobile);
              setTelephone(fetchedCliente.data.telephone);
              setFax(fetchedCliente.data.fax);
              setRepresentativeName(fetchedCliente.data.representativeName);
              setRepresentativeEmail(fetchedCliente.data.representativeEmail);
              setRepresentativeMobile(fetchedCliente.data.representativeMobile);
              setRepresentativeTelephone(fetchedCliente.data.representativeTelephone);
              setSelectedIdPaymentMethod(fetchedCliente.data.paymentMethod.id);
              setPaymentMethod(fetchedCliente.data.paymentMethod.name);
              setPaymentCondition(fetchedCliente.data.paymentConditions ? fetchedCliente.data.paymentConditions.toString() : '');
              setDiscount(fetchedCliente.data.discount);
              setAccountType(fetchedCliente.data.accountType);
              setInternalCode(fetchedCliente.data.internalCode);

              setCountry(fetchedCliente.data.country.id);
              setSelectedIdCountry(fetchedCliente.data.country.id);
              setRegion(fetchedCliente.data.region.id);
              setSelectedIdRegion(fetchedCliente.data.region?.id ? fetchedCliente.data.region.id.toString() : '');
              setCity(fetchedCliente.data.city.name);
              setSelectedIdCity(fetchedCliente.data.city?.id ? fetchedCliente.data.city.id.toString() : '');
              setPaymentMethod(fetchedCliente.data.paymentMethod.id);
              setSelectedIdPaymentMethod(fetchedCliente.data.paymentMethod?.id ? fetchedCliente.data.paymentMethod.id.toString() : '');

            } catch (error) {
              console.error(error);
            }
            setLoading(false);
          } else {
            console.error('Cliente indedifido ou não encontrado');
          }
        }).catch(error => {
          console.error('Erro no Cliente:', error);
        });
    }, [clienteId]);

    const handleConfirmarEditar = async () => {    
        EditarCliente(
          clienteId,
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
          ToastAndroid.show("Cliente Editado", ToastAndroid.SHORT);
        }).catch(error => {
          console.error('Erro ao editar Cliente:', error);
          ToastAndroid.show('Erro ao editar Cliente', ToastAndroid.SHORT);
        });
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
    return (
        <ScrollView>
            <View style={styles.container}>
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
        
        <View pointerEvents={isEditing ? 'auto' : 'none'} style={{marginTop: 10}}>


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

        {/* NIF - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>NIF</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={vat}
              onChangeText={text => setVat(text)}
              placeholder="NIF"
            />
          </View>
          
        {/* Country - Picker (getPaises) */}
        <Text style={styles.titleSelect}>País</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdCountry}
              onValueChange={itemValue => { setSelectedIdCountry(itemValue); setCountry(itemValue); }} >
              <Picker.Item label="Selecione um país" value={null} />
                  {Object.values(dadosPaises).map((pais, i) => (
                    <Picker.Item label={pais.description} value={pais.id} key={i} />
                  ))}
            </Picker>
          </View>

        {/* Address - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Localidade</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={text => setAddress(text)}
              placeholder="Localidade"
            />
          </View>

        {/* Postal Code - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Código Postal</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={postalCode}
              onChangeText={text => {
                // Check if the new text matches the required format or is an empty string
                if (/^\d{4}-\d{3}$/.test(text) || text === '') {
                  setPostalCode(text);
                }
              }}
              placeholder="xxxx-xxx"
            />
          </View>

        {/* City - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Cidade</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdCity}
              onValueChange={itemValue => {
                setSelectedIdCity(itemValue);
                setCity(itemValue);
                const selectedCity = Object.values(dadosCidades).find(cidade => cidade.id.toString() === itemValue);
                if (selectedCity) {
                  setSelectedIdRegion(selectedCity.id_region.toString());
                  setRegion(selectedCity.id_region.toString());
                }
              }}
            >
              <Picker.Item label="Selecione uma cidade" value={null} />
                  {Object.values(dadosCidades).map((cidade, i) => (
                    <Picker.Item label={cidade.description} value={cidade.id.toString()} key={i} />
                  ))}
            </Picker>
          </View>

        {/* Region - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Região</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdRegion}
              onValueChange={itemValue => { setSelectedIdRegion(itemValue); setRegion(itemValue); }} >
              <Picker.Item label="Selecione uma região" value={null} />
                  {Object.values(dadosRegioes).map((regiao, i) => (
                    <Picker.Item label={regiao.description} value={regiao.id.toString()} key={i} />
                  ))}
            </Picker>
          </View>

        {/* Email - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Email</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder="Email"
            />
          </View>

        {/* Website - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Website</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={text => setWebsite(text)}
              placeholder="Website"
            />
          </View>

        {/* Mobile - Obrigatório - TextInput */}  
        <Text style={styles.titleSelect}>Telemóvel</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={text => setMobile(text)}
              placeholder="Telemóvel"
            />
          </View>

        {/* Telephone - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Telefone</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={telephone}
              onChangeText={text => setTelephone(text)}
              placeholder="Telefone"
            />
          </View>

        {/* Fax - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Fax</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={fax}
              onChangeText={text => setFax(text)}
              placeholder="Fax"
            />
          </View>

        {/* Representative Name - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Nome Representante</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={representativeName}
              onChangeText={text => setRepresentativeName(text)}
              placeholder="Nome Representante"
            />
          </View>

        {/* Representative Email - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Email Representante</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={representativeEmail}
              onChangeText={text => setRepresentativeEmail(text)}
              placeholder="Email Representante"
            />
          </View>

        {/* Representative Mobile - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Telemóvel Representante</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={representativeMobile}
              onChangeText={text => setRepresentativeMobile(text)}
              placeholder="Telemóvel Representante"
            />
          </View>

        {/* Representative Telephone - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Telefone Representante</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={representativeTelephone}
              onChangeText={text => setRepresentativeTelephone(text)}
              placeholder="Telefone Representante"
            />
          </View>

        {/* Payment Method - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Método de Pagamento</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={selectedIdPaymentMethod}
              onValueChange={itemValue => { setSelectedIdPaymentMethod(itemValue); setPaymentMethod(itemValue); }} >
              <Picker.Item label="Selecione um método de pagamento" value={null} />
                  {dadosMetodosPagamento.map((metodo, i) => (
                    <Picker.Item label={metodo.name} value={metodo.id.toString()} key={i} />
                  ))}
            </Picker>
          </View>

        {/* Payment Condition - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Condições de Pagamento</Text>
          <View style={styles.borderMargin}>
            <Picker
              style={styles.pickerComponent}
              selectedValue={paymentCondition}
              onValueChange={itemValue => {
                setPaymentCondition(itemValue);}}
            >
              <Picker.Item label="Pronto Pagamento" value="1" />
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

        {/* Discount - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Desconto (%)</Text>
          <View style={styles.borderMargin}>
            <TextInput
              style={styles.input}
              value={discount}
              onChangeText={setDiscount}
              placeholder="Desconto"
              keyboardType="numeric"
            />
          </View>

        {/* Account Type - Obrigatório - Radio Button */}
        <Text style={styles.titleSelect}>Tipo de Conta Corrente</Text>
          <View style={styles.borderMargin}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <CheckBox
                  value={accountType === 1}
                  onValueChange={(newValue) => {
                    if (newValue) {
                      setAccountType(1);
                    }
                  }}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{alignSelf: 'center'}}>Conta Geral</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <CheckBox
                  value={accountType === 0}
                  onValueChange={(newValue) => {
                    if (newValue) {
                      setAccountType(0);
                    }
                  }}
                  style={{alignSelf: 'center'}}
                />
                <Text style={{alignSelf: 'center'}}>Conta Própria</Text>
              </View>
            </View>
          </View>


            </View>
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
  });
  
  
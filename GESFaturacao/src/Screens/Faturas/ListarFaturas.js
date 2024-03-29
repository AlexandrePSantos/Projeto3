import React, { useState, useEffect, useContext } from 'react';
import { useColorScheme, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../Context/AuthContext';

export default function ListarFaturas({ navigation }) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const [loading, setLoading] = useState(true);
  const { getFaturas, enviarEmail, finalizarFatura, removerFatura } = useContext(AuthContext);
  const [faturas, setFaturas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState(null);
  const [email, setEmail] = useState('');

  //filtro
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [allFaturas, setAllFaturas] = useState([]);

  const carregarFaturas = async () => {
    try {
      const response = await getFaturas();
      if (response.data) {
        const sortedFaturas = response.data.sort((a, b) => b.id - a.id);
        setFaturas(sortedFaturas);
        setAllFaturas(sortedFaturas);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    }
  };

  useEffect(() => {
    carregarFaturas();
  }, []);  

  const handleFinalizarFatura = async (fatura) => {
    try {
      await finalizarFatura(fatura.id);
      console.log('Fatura finalizada com sucesso', fatura.id);
      await carregarFaturas();
    } catch (error) {
      console.error('Erro ao finalizar fatura:', error);
    }
  };

  const handleRemoverFatura = async (fatura) => {
    try {
      await removerFatura(fatura.id);
      console.log('Fatura removida com sucesso', fatura.id);
      await carregarFaturas();
    } catch (error) {
      console.error('Erro ao remover fatura:', error);
    }
  };

  const handleEnviarEmail = async () => {
    try {
      await enviarEmail(email, "FT", selectedFatura.id);
      console.log('Email enviado com sucesso!');
      setEmail('');
      setModalVisible(false);
    } catch (error) {
      console.error('Falha ao enviar email:', error);
    }
  };

  const handlePress = (fatura) => {
    if (fatura.status === 'Aberto') {
      setSelectedFatura(fatura);
      setModalVisible(true);
    } else {
      handleFinalizarFatura(fatura);
    }
  };

  const renderItem = ({ item: fatura }) => {
    if (selectedStatus && fatura.status !== selectedStatus) {
      return null;
    }
    return(
      <View style={styles.faturaContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Detalhes Fatura', { faturaId: fatura.id })} >
          <View>
            <Text style={[styles.textInFaturaContainer, { marginTop: 5 }]}>Número: {fatura.title}</Text>
            <Text style={styles.textInFaturaContainer}>Cliente: {fatura.name}</Text>
            <Text style={styles.textInFaturaContainer}>NIF: {fatura.vatNumber} </Text>
            <Text style={styles.textInFaturaContainer}>Data: {fatura.dateFormatted}</Text>
            <Text style={styles.textInFaturaContainer}>Data Venc.: {fatura.expirationFormatted}</Text>
            <Text style={styles.textInFaturaContainer}>Total: {parseFloat(fatura.total).toFixed(2)} €</Text>
            <Text style={styles.textInFaturaContainer}>Saldo: {parseFloat(fatura.saldo).toFixed(2)} €</Text>
            <Text style={styles.textInFaturaContainer}>Estado: {fatura.status}</Text>
          </View>
        </TouchableOpacity>
        {fatura.status !== 'Anulado' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handlePress(fatura)}>
              <LinearGradient
                colors={['#ff8a2a', '#ffa500']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>{fatura.status === 'Aberto' ? 'Enviar' : 'Finalizar'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            {fatura.status === 'Rascunho' && (
              <TouchableOpacity onPress={() => handleRemoverFatura(fatura)}>
                <LinearGradient
                  colors={['#ff0000', '#ffa500']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>Remover</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };
  

  const keyExtractor = (item) => item.id.toString();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#ffffff' : '#d0933f'} />
      </View>
    );
  }
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
    <View style={styles.container}>
      <Picker
        style={styles.pickerComponent}
        selectedValue={selectedStatus}
        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
      >
        <Picker.Item label="Filtre por Estado" value={null} />
        <Picker.Item label="Rascunho" value="Rascunho" />
        <Picker.Item label="Aberto" value="Aberto" />
      </Picker>
      <FlatList
        data={faturas}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.titleSelect}>Insira email:</Text>
            <View style={styles.borderMargin}>
            <TextInput
              style={[styles.input, { width: 200, textAlign: 'center' }]}
              onChangeText={setEmail}
              value={email}
              placeholder="Insira o email"
              keyboardType="email-address"
            />
            </View>
            <View style={styles.buttonModal}>
              <CustomButtonModal
                title="Enviar"
                onPress={handleEnviarEmail}
                styles={styles}
                gradientColors={['#ff8a2a', '#ffa500']}
              />
            </View>
            <View style={styles.buttonModal}>
              <CustomButtonModal
                title="Cancelar"
                onPress={() => {
                  setEmail('');
                  setModalVisible(false);
                }}
                styles={styles}
                gradientColors={['#ff0000', '#ffa500']}
              />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const getStyles = (colorScheme) => StyleSheet.create({
  // General styles
  button: {
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100, 
    height: 35,
    marginRight: 10,
    marginLeft:10,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
  },
  // Text styles
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
    color: colorScheme === 'dark' ? '#ffffff' : '#5F5D5C',
  },
  textInFaturaContainer: {
    marginLeft: 10,
    color: colorScheme === 'dark' ? '#ffffff' : '#444444',
  },

  // Container styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  faturaContainer: {
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#ffffff' : '#BE6E31',
    width: 350,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#fff',
    borderRadius: 10,
    marginBottom: 50,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
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
    borderRadius:10,
  },
  borderMargin: {
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#ffffff' : 'grey',
    marginBottom: 15,
    borderRadius: 7,
  },
  buttonModal: {
    alignItems: 'center',
    width: 100,
    padding: 10,
    borderRadius:10,
  },
  modalText: {
    color: '#ffffff', // Letras brancas
    fontWeight: 'bold', // Negrito
    textAlign: 'center', // Centralizado
    fontSize: 15,
  },
});
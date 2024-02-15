import React, { useState, useEffect, useContext } from 'react';
import { useColorScheme, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import { AuthContext } from '../../Context/AuthContext';

export default function ListarOrcamentos({navigation}) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const [loading, setLoading] = useState(true);
  const { getOrcamentos, enviarEmail, finalizarOrcamento, removerOrcamento, getSeries } = useContext(AuthContext);
  const [orcamentos, setOrcamentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [email, setEmail] = useState('');

  // Filtro por status
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [allOrcamentos, setAllOrcamentos] = useState([]);

  // Função para carregar os dados dos orçamentos
  const carregarOrcamentos = async () => {
    try {
      const response = await getOrcamentos();
      if (response.data) {
        const sortedOrcamentos = response.data.sort((a, b) => b.id - a.id);
        setOrcamentos(sortedOrcamentos);
        setAllOrcamentos(sortedOrcamentos);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar Orçamentos:', error);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);  

  const handleFinalizarOrcamento = async (orcamento) => {
    try {
      await finalizarOrcamento(orcamento.id);
      console.log('Orçamento finalizado com sucesso', orcamento.id);
      await carregarOrcamentos();
    } catch (error) {
      console.error('Erro ao finalizar Orçamento:', error);
    }
  };

  const handleRemoverOrcamento = async (orcamento) => {
    try {
      await removerOrcamento(orcamento.id);
      console.log('Orçamento removido com sucesso', orcamento.id);
      await carregarOrcamentos();
    } catch (error) {
      console.error('Erro ao remover Orçamento:', error);
    }
  };

  const handleEnviarEmail = async () => {
    try {
      await enviarEmail(email, "OR", selectedOrcamento.id);
      console.log('Email enviado com sucesso!');
      setEmail('');
      setModalVisible(false);
    } catch (error) {
      console.error('Falha ao enviar email:', error);
    }
  };

  const handlePress = (orcamento) => {
    if (orcamento.status === 'Aberto') {
      setSelectedOrcamento(orcamento);
      setModalVisible(true);
    } else {
      handleFinalizarOrcamento(orcamento);
    }
  };

  const renderItem = ({ item: orcamento }) => {
    if (selectedStatus && orcamento.status !== selectedStatus) {
      return null;
    }

  

    return (
      <View style={styles.orcamentoContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Detalhes Orçamento', { orcamentoId: orcamento.id })}>
          <View>
            <Text style={[styles.textInOrcamentoContainer, { marginTop: 5 }]}>Número: {orcamento.title}</Text>
            <Text style={styles.textInOrcamentoContainer}>Cliente: {orcamento.name}</Text>
            <Text style={styles.textInOrcamentoContainer}>NIF: {orcamento.vatNumber} </Text>
            <Text style={styles.textInOrcamentoContainer}>Data: {orcamento.dateFormatted}</Text>
            <Text style={styles.textInOrcamentoContainer}>Data Venc.: {orcamento.expirationFormatted}</Text>
            <Text style={styles.textInOrcamentoContainer}>Total: {parseFloat(orcamento.total).toFixed(2)}€</Text>
            <Text style={styles.textInOrcamentoContainer}>Estado: {orcamento.status}</Text>
          </View>
        </TouchableOpacity>
        {orcamento.status !== 'ANULADO' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handlePress(orcamento)}>
              <LinearGradient
                colors={['#ff8a2a', '#ffa500']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>{orcamento.status === 'Aberto' ? 'Enviar' : 'Finalizar'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            {orcamento.status === 'Rascunho' && (
              <TouchableOpacity onPress={() => handleRemoverOrcamento(orcamento)}>
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

  // Loading indicator
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
    <View>
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
        data={orcamentos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.titleSelect}>Enter email: </Text>
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
  borderMargin: {
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#ffffff' : 'grey',
    marginBottom: 15,
    borderRadius: 7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  container: {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
  },
  // Text styles
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: colorScheme === 'dark' ? '#ffffff' : 'black',
  },
  textInOrcamentoContainer: {
    marginLeft: 10,
    color: colorScheme === 'dark' ? '#ffffff' : '#444444',
  },
  // Container styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orcamentoContainer: {
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
  pickerComponent: {
    height: 50,
    width: '100%',
    color: colorScheme === 'dark' ? '#ffffff' : '#444444',
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#ffffff' : '#444444',
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
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#ffffff' : '#5F5D5C',
  },
});

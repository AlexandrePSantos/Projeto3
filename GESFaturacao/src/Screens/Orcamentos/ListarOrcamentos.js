import React, { useState, useEffect, useContext } from 'react';
import { useColorScheme, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import { AuthContext } from '../../Context/AuthContext';

export default function ListarOrcamentos({navigation}) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const[loading, setLoading] = useState(true);
  const { getOrcamentos, enviarEmail, finalizarOrcamento, removerOrcamento } = useContext(AuthContext);
  const [orcamentos, setOrcamentos] = useState([]);
  const[modalVisible, setModalVisible] = useState(false);
  const[selectedOrcamento, setSelectedOrcamento] = useState(null);
  const[email, setEmail] = useState('');

  const carregarOrcamentos = async () => {
    try {
      const response = await getOrcamentos();
      if (response.data) {
        const sortedOrcamentos = response.data.sort((a, b) => b.id - a.id);
        setOrcamentos(sortedOrcamentos);
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
      console.log('Orçamento finalizada com sucesso', orcamento.id);
      await carregarOrcamentos();
    } catch (error) {
      console.error('Erro ao finalizar Orçamento:', error);
    }
  };

  const handleRemoverOrcamento = async (orcamento) => {
    try {
      await removerOrcamento(orcamento.id);
      console.log('Orçamento removida com sucesso', orcamento.id);
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

  const renderItem =({item: orcamento}) => (
    <View style={styles.orcamentoContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Detalhes Orçamento', {orcamentoId: orcamento.id})}>
        <View>
            <Text style={styles.textInOrcamentoContainer}>Número: {orcamento.title}</Text>
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
          <Button
            color={'gray'}
            title={orcamento.status === 'Aberto' ? 'Enviar' : 'Finalizar'}
            onPress={() => handlePress(orcamento)}
          />
          {orcamento.status === 'Rascunho' && (
          <Button
              color={'gray'}
              title="Remover"
              onPress={() => handleRemoverOrcamento(orcamento)}
            />
          )}
        </View>

      )}
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  // Loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#ffffff' : '#d0933f'} />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.titleSelect}></Text>
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
            <Text style={styles.modalText}>Enter email: </Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Insira o email"
              keyboardType="email-address"
            />
            <View style={styles.button}>
              <Button
                color={'gray'}
                title="Enviar"
                onPress={handleEnviarEmail}
              />
            </View>
            <View style={styles.button}>
              <Button
                color={'gray'}
                title="Cancelar"
                onPress={() => {
                  setEmail('');
                  setModalVisible(false);
                }}
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
    backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#d0933f',
  },
  input: {
    height: 40,
    marginTop: 10,
    marginBottom: 15,
    width: 250,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#fff',
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? '#ffffff' : 'grey',
    borderRadius: 7,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    elevation: 5
  },
});

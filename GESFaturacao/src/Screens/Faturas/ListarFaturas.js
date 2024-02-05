import React, { useState, useEffect, useContext } from 'react';
import { useColorScheme, StyleSheet, Text, Button, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

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

  const carregarFaturas = async () => {
    try {
      const response = await getFaturas();
      if (response.data) {
        const sortedFaturas = response.data.sort((a, b) => b.id - a.id);
        setFaturas(sortedFaturas);
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

  const renderItem = ({ item: fatura }) => (
    <View style={styles.faturaContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Detalhes Fatura', { faturaId: fatura.id })} >
        <View>
          <Text style={styles.textInFaturaContainer}>Número: {fatura.title}</Text>
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
        <Button
          color={'gray'}
          title={fatura.status === 'Aberto' ? 'Enviar' : 'Finalizar'}
          onPress={() => handlePress(fatura)}
        />
        {fatura.status === 'Rascunho' && (
          <Button
            color={'gray'}
            title="Remover"
            onPress={() => handleRemoverFatura(fatura)}
          />
        )}
      </View>
      )}
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#ffffff' : '#d0933f'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleSelect}></Text>
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
            <Text style={styles.modalText}>Insira email:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
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
    elevation: 5
  },
});
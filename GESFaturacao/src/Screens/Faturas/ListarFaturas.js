import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, Button, View, TextInput, TouchableOpacity } from 'react-native';
// import { FlatList } from 'react-native';
// import Modal from 'react-native-modal';

import { AuthContext } from '../../Context/AuthContext';

export default function ListarFaturas({ navigation }) {
  const { getFaturas, enviarEmail, finalizarFatura, removerFatura } = useContext(AuthContext);
  const [faturas, setFaturas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const carregarFaturas = async () => {
      try {
        const response = await getFaturas();
        if (response.data) {
          const sortedFaturas = response.data.sort((a, b) => b.id - a.id);
          setFaturas(sortedFaturas);
        }
      } catch (error) {
        console.error('Erro ao carregar faturas:', error);
      }
    };
    carregarFaturas();
  }, []);

  const handleFinalizarFatura = async (fatura) => {
    try {
      await finalizarFatura(fatura.id);
      console.log('Fatura finalizada com sucesso');
    } catch (error) {
      console.error('Erro ao finalizar fatura:', error);
    }
  };

  const handleRemoverFatura = async (fatura) => {
    try {
      await removerFatura(fatura.id);
      console.log('Fatura removida com sucesso', fatura.id);
    } catch (error) {
      console.error('Erro ao remover fatura:', error);
    }
  };

  const handleEnviarEmail = async () => {
    try {
      await enviarEmail(email, "FT", selectedFatura.id);
      console.log('Email sent successfully');
      setEmail('');
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to send email:', error);
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

  return (
    <ScrollView>
      <Text style={styles.titleSelect}>Lista de Faturas</Text>
      {faturas.map((fatura, index) => (
        <View key={index} style={styles.faturaContainer}>
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
          <View style={styles.buttonContainer}>
          <Button color={'gray'}
            title={fatura.status === 'Aberto' ? 'Enviar' : 'Finalizar'}
            onPress={() => handlePress(fatura)} />
          {fatura.status === 'Rascunho' && (
            <Button color={'gray'} title="Remover"
              onPress={() => handleRemoverFatura(fatura)} />
          )}
          </View>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter email:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter email"
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
                title="Cancel"
                onPress={() => {
                  setEmail('');
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
    color: "#5F5D5C",
  },
  faturaContainer: {
    borderWidth: 1,
    borderColor: '#BE6E31',
    width: 350,
    // height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 50,
    marginLeft:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  textInFaturaContainer: {
    marginLeft: 10,
    color: '#444444'
  },
  input: {
    height: 40,
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 7,
    marginBottom: 15,
    width: 250, 
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalView: {
    width: 300, 
    height: 250, 
    margin: 20,
    backgroundColor: "white",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    marginBottom: 10, 
  },
});


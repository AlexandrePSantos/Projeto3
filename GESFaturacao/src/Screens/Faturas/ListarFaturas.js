import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, ScrollView,Button, View, TextInput, Modal} from 'react-native';
import { AuthContext } from '../../Context/AuthContext';

export default function ListarFaturas({navigation, route}) {

const { getFaturas } = useContext(AuthContext);
const { enviarEmail } = useContext(AuthContext);
const { finalizarFatura } = useContext(AuthContext);
const { removerFatura } = useContext(AuthContext);

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

return (
    <ScrollView>
      <Text style={styles.titleSelect}>Lista de Faturas</Text>
      {faturas.map((fatura, index) => (
        <View key={index} style={styles.faturaContainer}>
          <Text style={styles.textInFaturaContainer}>ID: {fatura.id}</Text>
          <Text style={styles.textInFaturaContainer}>Cliente: {fatura.name}</Text>
          <Text style={styles.textInFaturaContainer}>Estado: {fatura.status}</Text>
          <Text style={styles.textInFaturaContainer}>Data: {fatura.dateFormatted}</Text>
          <Text style={styles.textInFaturaContainer}>Data de expiração: {fatura.expirationFormatted}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title={fatura.status === 'Aberto' ? 'Enviar' : 'Finalizar'}
              onPress={() => {
                if (fatura.status === 'Aberto') {
                  setSelectedFatura(fatura);
                  setModalVisible(true);
                } else {
                  console.log('Fatura:', fatura.id)
                  finalizarFatura(fatura.id)
                    .then(() => {
                      console.log('Fatura finalizada com sucesso');
                    })
                    .catch(error => {
                      console.error('Erro ao finalizar fatura:', error);
                    });
                }
              }}
            />
            <Button
              title="Editar"
              onPress={() => navigation.navigate('DetalhesFatura', { id: fatura.id })}
            />
            <Button
              title="Remover"
              onPress={() => {
                removerFatura(fatura.id)
                  .then(() => {
                    console.log('Fatura removida com sucesso', fatura.id);
                  })
                  .catch(error => {
                    console.error('Erro ao remover fatura:', error);
                  });
              }}
            />
          </View>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
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
                title="Enviar"
                onPress={() => {
                  enviarEmail(email, "FT", selectedFatura.id)
                    .then(() => {
                      console.log('Email sent successfully');
                      setEmail('');
                      setModalVisible(false);
                    })
                    .catch(error => {
                      console.error('Failed to send email:', error);
                    });
                }}
              />
            </View>
            <View style={styles.button}>
              <Button
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
    height: 100,
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


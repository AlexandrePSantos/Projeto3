import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, Button, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';

export default function ListarOrcamentos({navigation, route}) {

  const[loading, setLoading] = useState(true);
  const { getOrcamentos, enviarEmail, finalizarOrcamento, removerOrcamento } = useContext(AuthContext);
  const [orcamentos, setOrcamentos] = useState([]);
  const[modalVisible, setModalVisible] = useState(false);
  const[selectedOrcamento, setSelectedOrcamento] = useState(null);
  const[email, setEmail] = useState('');

  useEffect(() => {
      const carregarOrcamentos = async () => {
        try {
          const response = await getOrcamentos();
          if (response.data) {
            setOrcamentos(response.data);
          }
        } catch (error) {
          console.error('Erro ao carregar Orçamentos:', error);
        }
      };
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
    } catch (error) {
      console.error('Erro ao remover Orçamento:', error);
    }
  };

  const handleEnviarEmail = async () => {
    try {
      await enviarEmail(email, "FT", selectedOrcamento.id);
      console.log('Email sent successfully');
      setEmail('');
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to send email:', error);
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
            <Text style={styles.textInOrcamentoContainer}>ID: {orcamento.id}</Text>
            <Text style={styles.textInOrcamentoContainer}>Cliente: {orcamento.name}</Text>
            <Text style={styles.textInOrcamentoContainer}>Estado: {orcamento.status}</Text>
            <Text style={styles.textInOrcamentoContainer}>Data: {orcamento.dateFormatted}</Text>
            <Text style={styles.textInOrcamentoContainer}>Data de expiração: {orcamento.expirationFormatted}</Text>
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

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#d0933f" />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.titleSelect}>Lista de Orçamentos</Text>
      <FlatList
        data={orcamento}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
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

    </View>
  );
  /* 
  return (
      <ScrollView>
        <Text style={styles.titleSelect}>Lista de Orçamentos</Text>
        {orcamentos.map((orcamento, index) => (
          <View key={index} style={styles.orcamentoContainer}>
            <Text style={styles.textInOrcamentoContainer}>ID: {orcamento.id}</Text>
            <Text style={styles.textInOrcamentoContainer}>Cliente: {orcamento.name}</Text>
            <Text style={styles.textInOrcamentoContainer}>Estado: {orcamento.status}</Text>
            <Text style={styles.textInOrcamentoContainer}>Data: {orcamento.dateFormatted}</Text>
            <Text style={styles.textInOrcamentoContainer}>Data de expiração: {orcamento.expirationFormatted}</Text>
            {/*<Button
              title="Ver Detalhes"
              onPress={() => navigation.navigate('DetalhesFatura', { id: fatura.id })}
            />}
          </View>
        ))}
      </ScrollView>
    );
    */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e9ec',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  touch: {
    padding: 10,
    flexDirection:'row',
    justifyContent: 'space-between',
    margin: 10,
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  textfont: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#5F5D5C',
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold",
    color: "#5F5D5C",
  },
  borderMargin: {
    borderWidth: 1,
    borderColor: 'grey',
    marginLeft:10,
    marginRight:10,
    height:50,
    justifyContent: 'center',
  },
  dateComponent: {
    width: 350
  },
  touchableO: {
    width: 350,
    height: 55
  },
  textDate: {
    marginLeft:15,
    marginTop:15,
    fontSize: 16,
    color:"#000000"
  },
  marginTOPButton: {
    margin: 20
  },
  marginTOPButton2: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 7
  },
  orcamentoContainer: {
    borderWidth: 1,
    borderColor: '#BE6E31',
    width: 350,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    marginLeft:20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  textInOrcamentoContainer: {
    marginLeft: 10,
    color: '#444444'
  },
  textSelect: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  Alert,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {AuthContext} from '../../Context/AuthContext';
import {useForm, Controller} from 'react-hook-form';

export default function CriarArtigo({navigation}) {

  const {CriarArtigo} = useContext(AuthContext);
  const {control, handleSubmit} = useForm();

  function submitcliente(data) {
    console.log('adsa');
    console.log(data);
    CriarArtigo(data);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* NAME */}
        <Text style={styles.titleSelect}>Nome</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Nome"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Nome"
              />
            )}
          />
        </View>
        {/* CODE */}
        <Text style={styles.titleSelect}>Código</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Codigo"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Codigo"
              />
            )}
          />
        </View>
        {/* CATEGORY */}
        <Text style={styles.titleSelect}>Categoria</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Categoria"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Categoria"
              />
            )}
          />
        </View>
        {/* TYPE */}
        <Text style={styles.titleSelect}>Tipo</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Tipo"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Tipo"
              />
            )}
          />
        </View>
        {/* STOCK */}
        <Text style={styles.titleSelect}>Stock</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Stock"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Stock"
              />
            )}
          />
        </View>
        {/* MIN STOCK */}


        {/* STOCK ALERT */}


              
        {/* UNITY */}
        <Text style={styles.titleSelect}>Unidade</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Unidade"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Unidade"
              />
            )}
          />
        </View>

        {/* PVP */}
        <Text style={styles.titleSelect}>PreçoPVP</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="PrecoPVP"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="PrecoPVP"
              />
            )}
          />
        </View>
        {/* TAX */}
        <Text style={styles.titleSelect}>IVA</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="IVA"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="IVA"
              />
            )}
          />
        </View>

        {/* PRICE */}
        <Text style={styles.titleSelect}>Preço</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="Preco"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="Preco"
              />
            )}
          />
        </View>

        {/* BAR CODES */}
        <Text style={styles.titleSelect}>Código de Barras</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="CodigoBarras"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="CodigoBarras"
              />
            )}
          />
        </View>

        {/* SERIAL NUMBER */}
        <Text style={styles.titleSelect}>SerialNumber</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="SerialNumber"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="SerialNumber"
              />
            )}
          />
        </View>

        {/* RETENTION */}
        <Text style={styles.titleSelect}>Valor Retenção</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="RetencaoValor"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="RetencaoValor"
              />
            )}
          />
        </View>
        {/* RETENTION PERCENTAGE */}


        {/* EXEMPTION REASON */}


        {/* OBSERVATIONS */}
        <Text style={styles.titleSelect}>Descrição Longa</Text>
        <View style={styles.borderMargin}>
          <Controller
            control={control}
            name="DescricaoLonga"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="DescricaoLonga"
              />
            )}
          />
        </View>

        {/* LABEL */}


        {/* ENCOMENDAAQUI */}


        {/* ADD WORKSTATION */}


        {/* AVAILABLE MENU ARTICLE */}


        {/* COMENT AUTO FILL */}


        {/* CALCULATE MARGIN UNITARY ARTICLE */}


        {/* PROFIT MARGIN */}


        {/* PHYTO PHARMACEUTICAL */}


        {/* IMAGE */}


        {/* INITIAL PRICE */}



        {/* PRICES LINES */}


        {/* SUPPLIER LINES */}

        
        <View style={{marginLeft: 22, marginTop: 10, width: 350}}>
          <Button
            title="Criar Artigo"
            color="#d0933f"
            onPress={handleSubmit(submitcliente)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e9ec',

    justifyContent: 'flex-start',
  },
  touch: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#d0933f',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#d0933f',
    marginTop: 16,
    marginBottom: 5,
    width: 300,
    padding: 10,
  },
  icon: {
    position: 'absolute',
    left: 50,
  },
  textfont: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pickerComponent: {
    width: 350,
  },
  textSelect: {
    fontSize: 20,
    padding: 10,
    fontWeight: 'bold',
  },
  titleSelect: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
    color: '#5F5D5C',
  },
  borderMargin: {
    borderWidth: 1,
    borderColor: 'grey',
    marginLeft: 10,
    marginRight: 10,
  },
  dateComponent: {
    width: 350,
  },
  touchableO: {
    width: 350,
    height: 55,
  },
  textDate: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 16,
    color: '#000000',
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Dimensions, StyleSheet } from 'react-native';

const buttonSize = Dimensions.get('window').width / 2 - 30;

const getStyles = (colorScheme) => StyleSheet.create({
  titles: {
    fontSize: 25,
    fontWeight: "bold",
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    textAlign: 'left',
  },
  outerContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
  },
  menuButton: {
    width: buttonSize,
    height: 100,
    padding: 10,
    backgroundColor: '#BE6E31',
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 7,
  },
  menuText: {
    fontSize: 20,
    fontWeight: "bold",
    color:'#ffffff',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "bold",
    color:'#ffffff',
  },
  header: {
    backgroundColor: colorScheme === 'dark' ? '#333333' : '#e5e9ec',
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
  },
  button: {
    marginTop: 50,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  paddingBottom: {
    paddingBottom: 5,
    paddingTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
  }
});

export default function Home({navigation}) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.titles}>Faturas</Text>
      {/* Container Faturas */}
      <View style={styles.container}>
      {/* Botão criar fatura */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Fatura")}>
          <Text style={styles.menuText}>Criar</Text>
        </TouchableOpacity>
        {/* Botão listar faturas */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Faturas")}>
          <Text style={styles.menuText}>Listar</Text>
        </TouchableOpacity>
      </View>

      {/* Container Orçamentos */}
      <Text style={styles.titles}>Orçamentos</Text>
      <View style={styles.container}>
        {/* Botão criar Orçamento */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Orçamento")}>
          <Text style={styles.menuText}>Criar</Text>
        </TouchableOpacity>
        {/* Botão listar Orçamentos */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Orçamentos")}>
          <Text style={styles.menuText}>Listar</Text>
        </TouchableOpacity>
      </View>

      {/* Container Artigos */}
      <Text style={styles.titles}>Artigos</Text>
      <View style={styles.container}>
        {/* Botão criar Artigo */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Artigo")}>
          <Text style={styles.menuText}>Criar</Text>
        </TouchableOpacity>
        {/* Botão listar Artigos */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Artigos")}>
          <Text style={styles.menuText}>Listar</Text>
        </TouchableOpacity>
      </View>

      {/* Container Clientes */}
      <Text style={styles.titles}>Clientes</Text>
      <View style={styles.container}>
        {/* Botão criar Cliente */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Cliente")}>
          <Text style={styles.menuText}>Criar</Text>
        </TouchableOpacity>
        {/* Botão listar Clientes */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Clientes")}>
          <Text style={styles.menuText}>Listar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


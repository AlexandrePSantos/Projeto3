import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Dimensions, StyleSheet, ScrollView } from 'react-native';

const buttonSize = Dimensions.get('window').width / 2 - 30;

const getStyles = (colorScheme) => StyleSheet.create({
  titles: {
    fontSize: 25,
    fontWeight: "bold",
    color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    textAlign: 'center',
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
    height: 70,
    padding: 10,
    backgroundColor: '#BE6E31',
    marginVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
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

const Button = ({ title, onPress, styles }) => (
  <TouchableOpacity style={[styles.menuButton, styles.shadow]} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const Container = ({ title, children, styles }) => (
  <View>
    <Text style={styles.titles}>{title}</Text>
    <View style={styles.container}>
      {children}
    </View>
  </View>
);

export default function Home({navigation}) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  return (
    <ScrollView style={styles.outerContainer}>
    <View style={styles.outerContainer}>
      <Container title="Faturas" styles={styles}>
        <Button title="Criar" onPress={() => navigation.navigate("Criar Fatura")} styles={styles} />
        <Button title="Listar" onPress={() => navigation.navigate("Listar Faturas")} styles={styles} />
      </Container>

      <Container title="Orçamentos" styles={styles}>
        <Button title="Criar" onPress={() => navigation.navigate("Criar Orçamento")} styles={styles} />
        <Button title="Listar" onPress={() => navigation.navigate("Listar Orçamentos")} styles={styles} />
      </Container>

      <Container title="Artigos" styles={styles}>
        <Button title="Criar" onPress={() => navigation.navigate("Criar Artigo")} styles={styles} />
        <Button title="Listar" onPress={() => navigation.navigate("Listar Artigos")} styles={styles} />
      </Container>

      <Container title="Clientes" styles={styles}>
        <Button title="Criar" onPress={() => navigation.navigate("Criar Cliente")} styles={styles} />
        <Button title="Listar" onPress={() => navigation.navigate("Listar Clientes")} styles={styles} />
      </Container>
    </View>
    </ScrollView>
  );
};


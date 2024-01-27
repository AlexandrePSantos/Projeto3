import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import getStyles from './HomeStyles';


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
          <Text style={styles.menuText}>Criar Fatura</Text>
        </TouchableOpacity>
        {/* Botão listar faturas */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Faturas")}>
          <Text style={styles.menuText}>Listar Faturas</Text>
        </TouchableOpacity>
      </View>

      {/* Container Orçamentos */}
      <Text style={styles.titles}>Orçamentos</Text>
      <View style={styles.container}>
        {/* Botão criar Orçamento */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Orçamento")}>
          <Text style={styles.menuText}>Criar Orçamento</Text>
        </TouchableOpacity>
        {/* Botão listar Orçamentos */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Orçamentos")}>
          <Text style={styles.menuText}>Listar Orçamentos</Text>
        </TouchableOpacity>
      </View>

      {/* Container Artigos */}
      <Text style={styles.titles}>Artigos</Text>
      <View style={styles.container}>
        {/* Botão criar Artigo */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Artigo")}>
          <Text style={styles.menuText}>Criar Artigo</Text>
        </TouchableOpacity>
        {/* Botão listar Artigos */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Artigos")}>
          <Text style={styles.menuText}>Listar Artigos</Text>
        </TouchableOpacity>
      </View>

      {/* Container Clientes */}
      <Text style={styles.titles}>Clientes</Text>
      <View style={styles.container}>
        {/* Botão criar Cliente */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Cliente")}>
          <Text style={styles.menuText}>Criar Cliente</Text>
        </TouchableOpacity>
        {/* Botão listar Clientes */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Listar Clientes")}>
          <Text style={styles.menuText}>Listar Clientes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


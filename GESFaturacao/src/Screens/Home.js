import React, { useContext} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import styles from './HomeStyles';

export default function Home({navigation}) {

  const {logout} = useContext(AuthContext);

  return (
    <View style={styles.outerContainer}>
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
        {/* Botão criar Orçamento */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow]}
          onPress={() => navigation.navigate("Criar Orçamento")}>
          <Text style={styles.menuText}>Criar Orçamento</Text>
        </TouchableOpacity>
        {/* Botão criar Artigo */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shadow, { backgroundColor: 'gray' }]}
          onPress={() => navigation.navigate("Criar Artigo")}>
          <Text style={styles.menuText}>Criar Artigo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


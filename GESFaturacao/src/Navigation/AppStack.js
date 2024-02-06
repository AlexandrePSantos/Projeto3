import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, Button, View, StatusBar } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import * as Keychain from 'react-native-keychain';
import LinearGradient from 'react-native-linear-gradient';


import Login from '../Screens/Login';
import Home from '../Screens/Home';
import CriarFatura from '../Screens/Faturas/CriarFatura';
import ListarFaturas from '../Screens/Faturas/ListarFaturas';
import DetalhesFatura from '../Screens/Faturas/DetalhesFatura';
import CriarOrcamentos from '../Screens/Orcamentos/CriarOrcamento';
import ListarOrcamentos from '../Screens/Orcamentos/ListarOrcamentos';
import DetalhesOrcamento from '../Screens/Orcamentos/DetalhesOrcamento';
import CriarArtigo from '../Screens/Artigos/CriarArtigo';
import ListarArtigos from '../Screens/Artigos/ListarArtigos';
import DetalhesArtigo from '../Screens/Artigos/DetalhesArtigo';
import CriarCliente from '../Screens/Clientes/CriarCliente';
import ListarClientes from '../Screens/Clientes/ListarClientes';
import DetalhesCliente from '../Screens/Clientes/DetalhesCliente';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <>
      <StatusBar backgroundColor="rgba(154, 83, 27, 1)" barStyle="light-content" />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </>
  );
};

const screens = [
  { name: 'Dashboard', component: Home },
  { name: 'Criar Fatura', component: CriarFatura },
  { name: 'Listar Faturas', component: ListarFaturas },
  { name: 'Detalhes Fatura', component: DetalhesFatura},
  { name: 'Criar Orçamento', component: CriarOrcamentos },
  { name: 'Listar Orçamentos', component: ListarOrcamentos},
  { name: 'Detalhes Orçamento', component: DetalhesOrcamento},
  { name: 'Criar Artigo', component: CriarArtigo },
  { name: 'Listar Artigos', component: ListarArtigos },
  { name: 'Detalhes Artigo', component: DetalhesArtigo},
  { name: 'Criar Cliente', component: CriarCliente},
  { name: 'Listar Clientes', component: ListarClientes},
  { name: 'Detalhes Clientes', component: DetalhesCliente},
];

const AppStack = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await Keychain.resetGenericPassword();
    logout();
  };

  return (
    <>
      <StatusBar backgroundColor="#ff8a2a" barStyle="light-content" />
      <Stack.Navigator>
        {screens.map((screen) => (
          <Stack.Screen 
            key={screen.name}
            name={screen.name} 
            component={screen.component} 
            options={{ 
              header: () => 
                <CustomHeader 
                  title={screen.name} 
                  showBackButton={screen.name.startsWith('Criar') || screen.name.startsWith('Listar') || screen.name.startsWith('Detalhes')}
                  showLogoutButton={screen.name === 'Dashboard'} onLogout={handleLogout} />,
            }}
          />
        ))}
      </Stack.Navigator>
    </>
  );
};

export { AuthStack, AppStack };

const CustomHeader = ({ title, showBackButton, showLogoutButton, onLogout }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
    colors={['#ff8a2a', '#ffa500']}  // Colors from Button component
      style={styles.customHeader}
    >
      <View style={{ position: 'absolute', left: 10 }}>
        {showBackButton && (
          <Button title="Voltar" color="gray" onPress={() => navigation.goBack()} />
        )}
        {showLogoutButton && <Button title="Sair" color="gray" onPress={onLogout} />}
      </View>
      <Text style={styles.headerText}>{title}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: "bold"
  },
});
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, Button, View, StatusBar, useColorScheme } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import LinearGradient from 'react-native-linear-gradient';
import { Appearance } from 'react-native';

import Login from '../Screens/Login';
import Home from '../Screens/Home';
import CriarFatura from '../Screens/Faturas/CriarFatura';
import ListarFaturas from '../Screens/Faturas/ListarFaturas';
import DetalhesFatura from '../Screens/Faturas/DetalhesFatura';
import CriarOrcamentos from '../Screens/Orcamentos/CriarOrcamento';
import ListarOrcamentos from '../Screens/Orcamentos/ListarOrcamentos';
import CriarArtigo from '../Screens/Artigos/CriarArtigo';
import ListarArtigos from '../Screens/Artigos/ListarArtigos';

const colorScheme = Appearance.getColorScheme();
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
  { name: 'Criar Artigo', component: CriarArtigo },
  { name: 'Listar Artigos', component: ListarArtigos },
];

const AppStack = () => {
  const { logout } = useContext(AuthContext);
  const colorScheme = useColorScheme();

  const handleLogout = async () => {
    await Keychain.resetGenericPassword();
    logout();
  };

  return (
    <>
      <StatusBar backgroundColor="rgba(154, 83, 27, 1)" barStyle="light-content" />
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
      colors={['rgba(154, 83, 27, 1)', 'rgba(154, 83, 27, 0.6)']}
      style={styles.customHeader}
    >
      <View style={{ position: 'absolute', left: 10 }}>
        {showBackButton && <Button title="Back" color="gray" onPress={() => navigation.goBack()} />}
        {showLogoutButton && <Button title="Logout" color="gray" onPress={onLogout} />}
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
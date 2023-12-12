import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, Button, View, StatusBar } from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

import Login from '../Screens/Login';
import Home from '../Screens/Home';
import CriarFatura from '../Screens/Faturas/CriarFatura';
import ListarFaturas from '../Screens/Faturas/ListarFaturas';
import CriarOrcamentos from '../Screens/Orcamentos/CriarOrcamento';
import ListarOrcamentos from '../Screens/Orcamentos/ListarOrcamentos';
import CriarArtigo from '../Screens/Artigos/CriarArtigo';
import ListarArtigos from '../Screens/Artigos/ListarArtigos';

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

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <View style={{ marginLeft: 10 }}>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const LogoutButton = ({ onLogout }) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    onLogout();
    navigation.navigate('Login');
  };

  return (
    <View style={{ marginRight: 10 }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const screens = [
  { name: 'Dashboard', component: Home },
  { name: 'Criar Fatura', component: CriarFatura },
  { name: 'Listar Faturas', component: ListarFaturas },
  { name: 'Criar Orçamento', component: CriarOrcamentos },
  { name: 'Listar Orçamentos', component: ListarOrcamentos},
  { name: 'Criar Artigo', component: CriarArtigo },
  { name: 'Listar Artigos', component: ListarArtigos },
];

const AppStack = () => {
  const { logout } = useContext(AuthContext);

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
                  showBackButton={screen.name.startsWith('Criar') || screen.name.startsWith('Listar')}
                  showLogoutButton={screen.name === 'Dashboard'} onLogout={logout} />,
            }}
          />
        ))}
      </Stack.Navigator>
    </>
  );
};

export { AuthStack, AppStack };

// -------
// Styling
// -------
const CustomHeader = ({ title, showBackButton, showLogoutButton, onLogout }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['rgba(154, 83, 27, 1)', 'rgba(154, 83, 27, 0.6)']}
      style={styles.customHeader}
    >
      {showBackButton && (
        <View style={{ position: 'absolute', left: 10 }}>
          <Button title="Back" color="gray" onPress={() => navigation.goBack()} />
        </View>
      )}
      {showLogoutButton && (
        <View style={{ position: 'absolute', left: 10 }}>
          <Button title="Logout" color="gray" onPress={onLogout} />
        </View>
      )}
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
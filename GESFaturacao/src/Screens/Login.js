import React, {useContext, useEffect, useState} from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  Text,
  Keyboard,
  View,
  TouchableOpacity, 
  Image,
  StyleSheet,
  useColorScheme,
  Switch,
  ActivityIndicator,
  ToastAndroid 
} from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';

const Login = ({}) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const {isLoggedIn, login} = useContext(AuthContext);

  const [rememberCredentials, setRememberCredentials] = useState(false);

  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    navbar: {
      width: '100%',
      height: '45%',
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: '#ff8a2a',
      marginBottom: 50,
    },
    logo: {
      width: keyboardStatus ? '70%' : '80%', 
      height: keyboardStatus ? '60%' : '70%', 
      resizeMode: 'contain',
      marginTop: 50,
    },
    background: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
    },
    inputsContainer: {
      flex: 2,
      width: '90%',
      alignItems: 'center',
      marginTop: keyboardStatus ? '0%' : '10%',
    },
    input: {
      backgroundColor: colorScheme === 'dark' ? '#333333' : '#fff',
      color: colorScheme === 'dark' ? '#fff' : '#000',
      width: '90%',
      marginBottom: 25,
      borderRadius: 7,
      borderBottomWidth: 1,
      borderBottomColor: '#ff8a2a',
    },
    inputWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 5,
    },
    showPasswordButton: {
      position: 'absolute',
      right: 10,
      top: '21%',
    },
    btnSignIn: {
      backgroundColor: '#ff8a2a',
      borderRadius: 7,
      marginTop: 15,
      marginBottom: 15,
    },
    textSignIn: {
      marginBottom: 8,
      marginTop: 8,
      marginLeft: 15,
      marginRight: 15,
      fontSize: 20,
      fontWeight: "bold",
      color:'#ffffff',
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardStatus(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardStatus(false);
      }
    );

    const loadCredentials = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && !isLoggedIn) {
        setUsername(credentials.username);
        setPassword(credentials.password);
        login(credentials.username, credentials.password); // log-in automático
      }
    };
    loadCredentials();

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      ToastAndroid.show('Nome de utilizador e palavra-passe são obrigatórios.', ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    if (rememberCredentials) {
      await Keychain.setGenericPassword(username, password);
    }
    login(username, password).finally(() => setIsLoading(false));
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.background}
    >
    <LinearGradient colors={['#ff8a2a', '#ffa65d']} style={styles.navbar} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} >
      <Image 
        source={require('./assets/logotipoW.png')}
        style={styles.logo} 
      />
    </LinearGradient>
  <View style={styles.inputsContainer}>
    <TextInput
      style={styles.input}
      value={username}
      autoCapitalize='none'
      onChangeText={text => setUsername(text)}
      placeholder="Nome de utilizador"
      placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'} 
      accessibilityLabel="Username"
    />

    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={password}
        autoCapitalize='none'
        onChangeText={text => setPassword(text)}
        placeholder="Palavra-passe"
        placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
        secureTextEntry={!showPassword}
        accessibilityLabel="Password"
      />
      <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPassword(!showPassword)}>
      <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>
        {showPassword ? 'Esconder' : 'Mostrar'}
      </Text>
      </TouchableOpacity>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Switch 
        value={rememberCredentials} 
        onValueChange={setRememberCredentials} 
        trackColor={{ false: "#767577", true: "#ff8a2a" }} 
        thumbColor={rememberCredentials ? "#ff8a2a" : "#f4f3f4"}
      />
      <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>Lembrar credênciais?</Text>
    </View>
    <TouchableOpacity style={styles.btnSignIn} onPress={handleLogin} disabled={isLoading}>
      {isLoading ? <ActivityIndicator /> : <Text style={styles.textSignIn}>Entrar</Text>}
    </TouchableOpacity>
  </View>
</KeyboardAvoidingView>
  );
};

export default Login;


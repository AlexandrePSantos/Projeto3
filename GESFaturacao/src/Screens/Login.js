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
  useColorScheme
} from 'react-native';
import { AuthContext } from '../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

const Login = ({navigation}) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const {login} = useContext(AuthContext);

  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    navbar: {
      width: '100%',
      height: '45%',
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: '#BE6E31',
      marginBottom: 50,
    },
    logo: {
      width: keyboardStatus ? '70%' : '80%', // 70% of the navbar's width when the keyboard is not visible
      height: keyboardStatus ? '60%' : '70%', // 70% of the navbar's height when the keyboard is not visible
      resizeMode: 'contain', // Keep the image's aspect ratio
      marginTop: 50,
    },
    background: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
    },
    inputsContainer: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
    },
    input: {
      backgroundColor: colorScheme === 'dark' ? '#333333' : '#fff',
      width: '80%',
      marginBottom: 30,
      borderRadius: 7,
      borderBottomWidth: 1,
      borderBottomColor: '#BE6E31',
    },
    inputWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 10,
    },
    showPasswordButton: {
      position: 'absolute',
      right: 10,
      top: '27%',
    },
    btnSignIn: {
      backgroundColor: '#BE6E31',
      borderRadius: 7,
      marginBottom: 15,
      marginTop: 10,
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

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
        // Show some error message
        return;
    }
    setIsLoading(true);
    login(username, password).finally(() => setIsLoading(false));
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.background}
    >
    <LinearGradient colors={['#9A531B', '#BE6E31', '#E59450']} style={styles.navbar} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} >
      <Image 
        source={require('./assets/logo_old.png')}
        style={styles.logo} 
      />
    </LinearGradient>
  <View style={styles.inputsContainer}>
    <TextInput
      style={styles.input}
      value={username}
      autoCapitalize='none'
      onChangeText={text => setUsername(text)}
      placeholder="Username"
      accessibilityLabel="Username"
    />

    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={password}
        autoCapitalize='none'
        onChangeText={text => setPassword(text)}
        placeholder="Password"
        secureTextEntry={!showPassword}
        accessibilityLabel="Password"
      />
      <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPassword(!showPassword)}>
        <Text>{showPassword ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.btnSignIn} onPress={handleLogin} disabled={isLoading}>
      {isLoading ? <ActivityIndicator /> : <Text style={styles.textSignIn}>Sign-in</Text>}
    </TouchableOpacity>
  </View>
</KeyboardAvoidingView>
  );
};

export default Login;


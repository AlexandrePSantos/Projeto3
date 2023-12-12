import React, {useContext, useEffect, useState} from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  Text,
  Keyboard,
  View,
  TouchableOpacity, 
  Image
} from 'react-native';
import styles from './LoginStyles';
import { AuthContext } from '../Context/AuthContext';

const Login = ({navigation}) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const {login} = useContext(AuthContext);

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
      <View style={[styles.containerLogo, keyboardStatus ? { height: 50 } : { height: 100 }]}>
        <Image source={require('./assets/logo_old.jpg')}
        style={[styles.logo, keyboardStatus ? { borderRadius: 25, height: 200, width: 200 } : { borderRadius: 25 }]} />        
      </View>      
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
        {isLoading ? <ActivityIndicator /> : <Text style={styles.signIn}>Sign-in</Text>}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
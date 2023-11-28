import React, {useContext, useState} from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  Text,
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
  const {login} = useContext(AuthContext);

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
      <Image source={require('./assets/logo_old.jpg')}  style={styles.containerLogo}/>        
      <TextInput
        style={styles.input}
        value={username}
        autoCapitalize='none'
        onChangeText={text => setUsername(text)}
        placeholder="Username"
        accessibilityLabel="Username"
      />

      <TextInput
        style={styles.input}
        value={password}
        autoCapitalize='none'
        onChangeText={text => setPassword(text)}
        placeholder="Password"
        secureTextEntry={!showPassword}
        accessibilityLabel="Password"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text>Show Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSignIn} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator /> : <Text style={styles.signIn}>Sign-in</Text>}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Login;
import React, {useContext, useState} from 'react';
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity, 
  Image
} from 'react-native';
import styles from './LoginStyles';
import { AuthContext } from '../Context/AuthContext';

const Login = ({navigation}) => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const {login} = useContext(AuthContext);

  return (
    <View style={styles.background}>
        {/* <Image source={require('./assets/gesf.png')}  style={styles.img}/> */}
        <Image source={require('./assets/logo_old.jpg')}  style={styles.containerLogo}/>        
        
        <TextInput
          style={styles.input}
          value={username}
          autoCapitalize='none'
          onChangeText={text => setUsername(text)}
          placeholder="Username"
        />

        <TextInput
          style={styles.input}
          value={password}
          autoCapitalize='none'
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          secureTextEntry
        />

        {/* <Button style={styles.btnSignIn}
          title="Iniciar Sessão" color='#d0933f'
          onPress={() => {login(username, password)}}
        /> */}
        <TouchableOpacity style={styles.btnSignIn} onPress={() => {login(username, password)}}>
          <Text style={styles.signIn}>Sign-in</Text>
        </TouchableOpacity>
        </View>
  );
};

export default Login;
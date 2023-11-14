import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
//substituir pelo authstack e appstack
import Home from '../Screens/Home';

const Stack = createNativeStackNavigator();

const Logo = () => (
  <Image
  source={require('../Screens/assets/logotipo.png')}
  style={{ width: 40, height: 40, marginRight: 10}}
  />
  );

const AppStack = () => {

    return (
      <Stack.Navigator>
        {/* <Stack.Screen name="GesFaturação" component={Home} options={{headerLeft: () => <Logo />}}/> */}
        <Stack.Screen name="Dashboard" component={Home} options={{headerTitleAlign: 'center'}}/>
      </Stack.Navigator>
    );
};

export default AppStack;
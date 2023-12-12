import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import Login from '../Screens/Login';

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

export default AuthStack;
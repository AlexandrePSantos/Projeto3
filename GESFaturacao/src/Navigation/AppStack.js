import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home';
import CriarFatura from '../Screens/Faturas/CriarFatura';
import CriarOrcamentos from '../Screens/Orcamentos/CriarOrcamento';
import CriarArtigo from '../Screens/Artigos/CriarArtigo';

const Stack = createNativeStackNavigator();

const AppStack = () => {

    return (
      <Stack.Navigator>
        <Stack.Screen name='Dashboard' component={Home} options={{headerTitleAlign: 'center'}}/>
        <Stack.Screen name='Criar Fatura' component={CriarFatura} options={{headerTitleAlign: 'center'}}/>
        <Stack.Screen name='Criar Orçamento' component={CriarOrcamentos} options={{headerTitleAlign: 'center'}}/>
        <Stack.Screen name='Criar Artigo' component={CriarArtigo} options={{headerTitleAlign: 'center'}}/>
      </Stack.Navigator>
    );
};

export default AppStack;
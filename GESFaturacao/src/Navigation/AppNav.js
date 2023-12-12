import {View, ActivityIndicator} from 'react-native';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

//substituir pelo authstack e appstack
// import AuthStack from './AuthStack';
// import AppStack from './AppStack';
import { AuthStack, AppStack } from './AppStack';
import { AuthContext } from '../Context/AuthContext';

const AppNav = () => {
    const {isLoading, userToken} = useContext(AuthContext);

    if( isLoading ){
        return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} />
        </View>
        );
    }
    
    return (
        <NavigationContainer>
            {userToken !== null ?  <AppStack /> : <AuthStack/>}
        </NavigationContainer>
    );
}

export default AppNav
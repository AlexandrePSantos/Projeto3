import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';

import { ToastAndroid } from 'react-native';


//Possibilita passar qualquer valor para qualquer ecrã da app

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [nome, setNome] = useState(null);

    const login = async (username, password) => {
        setIsLoading(true);
        axios.post(`${BASE_URL}/authentication`, { username, password })
        .then(async res => {
            console.log(res.data);
            let userInfo = res.data;
            setUserInfo(userInfo);
            setUserToken(userInfo._token);
            setNome(username);
            await AsyncStorage.setItem('@userInfo', JSON.stringify(userInfo));
            await AsyncStorage.setItem('@userToken', userInfo._token);
            console.log("User Token: " + userInfo._token);
            ToastAndroid.show("Bem-vindo, " + username, ToastAndroid.SHORT);
        })
        .catch(e => {
            console.log(`Login error ${e}`);
        });
    
        setIsLoading(false);
    }

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        await AsyncStorage.removeItem('@userInfo');
        await AsyncStorage.removeItem('@userToken');
        setIsLoading(false);
        // ToastAndroid.show("Obrigado pela preferência, " + nome, ToastAndroid.SHORT);
    }

    const CriarFatura = async (clienteC, serieC, numeroC, dataC, validadeC, referenciaC, vencimentoC, moedaC, descontoC, observacoesC, LinhasC, finalizarDocumentoC) =>{
        var token = await this.getToken();
        console.log(clienteC + ' Cliente');
        console.log(serieC + ' Serie');
        console.log(numeroC + ' num');
        console.log(dataC + ' data');
        console.log(validadeC + ' val');
        console.log(referenciaC + ' ref');
        console.log(vencimentoC + ' ven');
        console.log(moedaC + ' moeda');
        console.log(descontoC + ' des');
        console.log(observacoesC + ' obs');
        console.log(JSON.stringify(LinhasC) + ' linha');
        console.log(finalizarDocumentoC + ' fim');

        const stringifiedLinhas = JSON.stringify(LinhasC);
        return axios({
            url: `${BASE_URL}/invoices`,
            method: 'POST',
            timeout: 5000,
            data: qs.stringify({
                opcao: '2',
                _token: token,
                cliente: clienteC,
                serie: serieC,
                numero: numeroC,
                moeda: 1,
                data: dataC,
                validade: validadeC,
                referencia: referenciaC,
                vencimento: vencimentoC,
                desconto: descontoC,
                observacoes: observacoesC,
                finalizarDocumento: finalizarDocumentoC,
                pagamento: 0,
                Linhas: stringifiedLinhas,
            }),
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        });
    }

    const getArtigos = async () =>{
        var token = await this.getToken();

        return axios({
            url: `${BASE_URL}/api/tabelas/artigos`,
            method: 'GET',
            params: {
                opcao: '0',
                pag: '0',
                numRows: '25',
                _token: token
            },
            headers: {
                Accept: 'application/json',
            },
        });
    }

    return(
        <AuthContext.Provider value={{login, logout, CriarFatura, getArtigos, isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
}
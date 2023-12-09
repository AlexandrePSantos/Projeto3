import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';
import qs from 'qs';

import { ToastAndroid } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [nome, setNome] = useState(null);

    getToken = async () => AsyncStorage.getItem('@userToken');
    // ------!-------
    // Login & Logout
    // ------!-------
    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/authentication`, { username, password });
            // console.log(res.data);
            let userInfo = res.data;
            setUserInfo(userInfo);
            setUserToken(userInfo._token);
            setNome(username);
            await AsyncStorage.setItem('@userInfo', JSON.stringify(userInfo));
            await AsyncStorage.setItem('@userToken', userInfo._token);
    
            // console.log("User Token: " + userInfo._token);
            ToastAndroid.show("Bem-vindo, " + username, ToastAndroid.SHORT);
    
            // Validate token
            const tokenRes = await axios.post(`${BASE_URL}/validate-token`, {}, {
                headers: {
                    'Authorization': userInfo._token,
                }
            });
            // console.log(tokenRes.data);
    
            // Prepare the data for the validate-version request
            let data = qs.stringify({
                'version': '6',
                'os': 'android' 
            });
    
            // Prepare the config for the validate-version request
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://licencas.gesfaturacao.pt/server/auto/validate-version',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'Authorization': 'Basic UjBWVFJrRlVWVkpCUTBGUDpNWFk0T0dKaWQyZHJaWEkzYmpreWFXUTNNVGs9',
                },
                data : data
            };
    
            // Validate version
            const versionRes = await axios.request(config);
            // console.log(versionRes.data);
        } catch(e) {
            console.log(`Login error ${e}`);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        await AsyncStorage.removeItem('@userInfo');
        await AsyncStorage.removeItem('@userToken');
        setIsLoading(false);
    }

    // ------!-------   
    //  M. Pagamento
    // ------!-------
    const getMetodos = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://devipvc.gesfaturacao.pt/gesfaturacao/server/webservices/api/mobile/v1.0.2/payment-methods',
            headers: { 
              'Authorization': token
            },
            data : data
          };
    
        return axios.request(config)
        .then((response) => {
        // console.log(JSON.stringify(response.data));
        return response.data; 
        })
        .catch((error) => {
        console.log(error);
        });
    }

    // ------!-------
    //    Faturas
    // ------!-------
    const CriarFatura = async (clienteC, serieC, numeroC, dataC, validadeC, dueDateC, referenciaC, moedaC, descontoC, observacoesC, metodoC, finalizarDocumentoC) => {
        var token = await this.getToken();
        // const stringifiedLinhas = JSON.stringify(LinhasC);
    
        let data = qs.stringify({
            'client': clienteC,
            'serie': serieC,
            'number': numeroC,
            'date': dataC,
            'expiration': validadeC,
            'reference': referenciaC,
            'dueDate': dueDateC,
            'coin': moedaC,
            'discount': descontoC,
            'observations': observacoesC,
            'finalize': finalizarDocumentoC,
            'payment': metodoC,
            'lines': '[{"id":"113","description":"Tinteiro Compatível Epson T1631 Preto","quantity":"1","price":"1.22","discount":"0","tax":1,"exemption":"0","retention":0}]',
            'doc_origin': '9' 
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://devipvc.gesfaturacao.pt/gesfaturacao/server/webservices/api/mobile/v1.0.2/invoices`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': token, 
            },
            data : data
        };
    
        return axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error + ' Erro Faturas');
            });
    }

    // ------!-------
    //   Clientes
    // ------!-------
    const getClientes = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://devipvc.gesfaturacao.pt/gesfaturacao/server/webservices/api/mobile/v1.0.2/clients',
            headers: { 
              'Authorization': token
            },
            data : data
          };
    
        return axios.request(config)
        .then((response) => {
        // console.log(JSON.stringify(response.data));
        return response.data; 
        })
        .catch((error) => {
        console.log(error);
        });
    }

    // ------!-------
    //    Series
    // ------!-------
    const getSeries = async () => {
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://devipvc.gesfaturacao.pt/gesfaturacao/server/webservices/api/mobile/v1.0.2/series',
            headers: { 
              'Authorization': token
            }
        };
          
        return axios.request(config)
        .then((response) => {
        // console.log(JSON.stringify(response.data));
        return response.data; 
        })
        .catch((error) => {
        console.log(error + ' Erro Series');
        });
    }

    // ------!-------
    //    Artigos
    // ------!-------
    const getArtigos = async () =>{
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://devipvc.gesfaturacao.pt/gesfaturacao/server/webservices/api/mobile/v1.0.2/products',
            headers: { 
                'Authorization': token
            }
        };
          
        return axios.request(config)
        .then((response) => {
        // console.log(JSON.stringify(response.data));
        return response.data; 
        })
        .catch((error) => {
        console.log(error);
        });
    }

    // ------!-------
    //   Orcamentos
    // ------!-------
    const CriarOrcamentos = async (clienteC, serieC, numeroC, dataC, validadeC, referenciaC, vencimentoC, moedaC, descontoC, observacoesC, LinhasC, finalizarDocumentoC) => {
        
        var token = await this.getToken();
        //const LinhasC = [{"artigo": "0001", "descricao":descricaoC, "qtd":qtdC, "preco": "19.01", "imposto": "1", "motivo":motivoC, "desconto":descontoCL, "retencao":retencaoC}];
        const stringifiedLinhas = JSON.stringify(LinhasC);
        let data = qs.stringify({
            'client': clienteC,
            'serie': serieC,
            'number': numeroC,
            'date': dataC,
            'expiration': validadeC,
            'reference': referenciaC,
            'dueDate': vencimentoC,
            'coin': moedaC,
            'discount': descontoC,
            'observations': observacoesC,
            'finalize': finalizarDocumentoC,
            'payment': 0,
            'lines': stringifiedLinhas,
            'doc_origin': '9' 
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/budgets`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': token, 
                'Cookie': 'PHPSESSID=2126001ea125fd6cd0c8d1029eb1497a'
            },
            data : data
        };


        return axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error + ' Erro Faturas');
            });
        
    }

    const getOrcamentos = async ()=> {
        var token = await this.getToken();

        return axios({
            url: `${BASE_URL}/api/orcamentos/orcamentos`,
            method: 'GET',
            timeout: 5000,
            params: {
                opcao: '0',
                _token: token,
                pag: '0',
                numRows: '25',
            },
            headers: {
                Accept: 'application/json',
            }
        }); 
    }

    // ------!-------
    // Return Values
    // ------!-------
    return(
        <AuthContext.Provider value={{login, logout, 
            CriarOrcamentos, getOrcamentos,
            getSeries,
            getArtigos, 
            CriarFatura,
            getClientes, 
            getMetodos,
            isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
}
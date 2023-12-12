import React, {createContext, useState} from 'react';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';

const BASE_URL = 'https://devipvc.gesfaturacao.pt/gesfaturacao/server/webservices/api/mobile/v1.0.2';

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
            let userInfo = res.data;
            setUserInfo(userInfo);
            setUserToken(userInfo._token);
            setNome(username);
            await AsyncStorage.setItem('@userInfo', JSON.stringify(userInfo));
            await AsyncStorage.setItem('@userToken', userInfo._token);
    
            ToastAndroid.show("Bem-vindo, " + username, ToastAndroid.SHORT);
    
            // Validate token
            const tokenRes = await axios.post(`${BASE_URL}/validate-token`, {}, {
                headers: {
                    'Authorization': userInfo._token,
                }
            });
    
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
            url: `${BASE_URL}/payment-methods`,
            headers: { 
              'Authorization': token
            },
            data : data
          };
    
        return axios.request(config)
        .then((response) => {
        return response.data; 
        })
        .catch((error) => {
        console.log(error);
        });
    }

    // ------!-------
    //    Faturas
    // ------!-------
    const CriarFatura = async (clienteC, serieC, numeroC, dataC, validadeC, dueDateC, referenciaC, moedaC, descontoC, observacoesC, metodoC, linhasC, finalizarDocumentoC) => {
        var token = await this.getToken();
    
        const linhas = JSON.stringify(linhasC);
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
            'lines': linhas,
            'doc_origin': '0' 
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/invoices`,
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

    const getFaturas = async ()=> {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/invoices`,
            headers: { 
              'Authorization': token
            },
            data : data
          };
    
        return axios.request(config)
            .then((response) => {
            return response.data; 
            })
            .catch((error) => {
            console.log(error);
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
            url: `${BASE_URL}/clients`,
            headers: { 
              'Authorization': token
            },
            data : data
          };
    
        return axios.request(config)
        .then((response) => {
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
            url: `${BASE_URL}/series`,
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
            url: `${BASE_URL}/products`,
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

    const getArtigoID = async (id) =>{
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/products/${id}`,
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
    const CriarOrcamento  = async (clienteC, serieC, numeroC, dataC, validadeC, dueDateC, referenciaC, moedaC, descontoC, observacoesC, linhasC, finalizarDocumentoC) => {
        var token = await this.getToken();
    
        const linhas = JSON.stringify(linhasC);
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
            'lines': linhas
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/budgets`,
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
                console.log(error + ' Erro Orçamentos');
            });
    }

    const getOrcamentos = async ()=> {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/budgets`,
            headers: { 
              'Authorization': token
            },
            data : data
          };
    
        return axios.request(config)
            .then((response) => {
            return response.data; 
            })
            .catch((error) => {
            console.log(error);
        });
    }    

    // ------!-------
    // Return Values
    // ------!-------
    return(
        <AuthContext.Provider value={{login, logout, 
            CriarOrcamento, getOrcamentos,
            getSeries,
            getArtigos, getArtigoID,
            CriarFatura, getFaturas,
            getClientes, 
            getMetodos,
            isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
}

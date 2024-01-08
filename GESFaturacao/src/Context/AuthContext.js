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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            ToastAndroid.show('Incorrect username or password.', ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
        setIsLoggedIn(true);
    }

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        await AsyncStorage.removeItem('@userInfo');
        await AsyncStorage.removeItem('@userToken');
        setIsLoading(false);
        setIsLoggedIn(false);
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
                // console.log(JSON.stringify(response.data));
                return response.data;
            })
            .catch((error) => {
                console.log(error + ' Erro Faturas');
            });
    }

    const EditarFatura = async () => {
        var token = await this.getToken();
    
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

    const getFaturasById = async (id) => {
        var token = await this.getToken();

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/invoices?id=${id}`,
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

    // TODO - Finalizar fatura
    // !!! Retorna erro 400 !!!
    const finalizarFatura = async (id) => {
        var token = await this.getToken();

        let data = qs.stringify({ 
            'id': id,
            'finalize': '1' 
        });
        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/invoices`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': token
            },
            data : data
        };
    
        return axios.request(config)
            .then((response) => {
                console.log(response.data);
                return response.data; 
            })
            .catch((error) => {
                console.log(error);
        });
    }

    // TODO - Remover fatura    
    // !!! Retorna erro 400 !!!
    const removerFatura = async (id) => {
        var token = await this.getToken();

        let data = qs.stringify({ 'id': id });
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/invoices`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token
            },
            data: data
        };

        return axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error + ' Erro Remover Faturas');
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
    const CriarArtigo = async (code, name, type, unit, qtdStock, qtdStockMin, stockMin, pvp, precoUnit, precoIni, iva, category) => {
        var token = await this.getToken();

        let data = qs.stringify({
            'code': code,
            'name': name,
            'category': category,
            'type': type,
            'stock': qtdStock,
            'minStock': qtdStockMin,
            'stockAlert': stockMin,
            'unity': unit,
            'pvp': pvp,
            'tax': iva,
            'price': precoUnit,
            'initialPrice': precoIni
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/products`,
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

    const EditarArtigo = async () => {
        var token = await this.getToken();
    
    }

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

    // TODO - Remover artigo
    const removerArtigo = async (id) => {
        var token = await this.getToken();

        let data = qs.stringify({
            'id': id
        });
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/products`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token
            },
            data: data
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
    //   Categorias
    // ------!-------
    const getCategorias = async () =>{
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/categories`,
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
    //      IVA
    // ------!-------
    const getIVA = async () =>{
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/vats`,
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
                // console.log(JSON.stringify(response.data));
                return response.data;
            })
            .catch((error) => {
                console.log(error + ' Erro Orçamentos');
            });
    }

    const EditarOrcamento = async () => {
        var token = await this.getToken();
    
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

    // TODO - Finalizar orcamento
    // !!! Retorna erro 400 !!!
    const finalizarOrcamento = async (id) => {
        var token = await this.getToken();

        let data = qs.stringify({ 
            'finalizeDocument': id 
        });
        let config = {
            method: 'put',
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

    // TODO - Remover orcamento
    // !!! Retorna erro 400 !!!
    const removerOrcamento = async (id) => {
        var token = await this.getToken();

        let data = qs.stringify({
            'id': id
        });
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/budgets`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': token
            },
            data: data
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
    //     Email
    // ------!-------
    const enviarEmail = async (email, type, docId) => {
        var token = await this.getToken();
    
        let data = qs.stringify({
            'email': email,
            'type': type,
            'document': docId
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/send-email`,
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
                console.log(error + ' Erro Email');
            });
    }

    // ------!-------
    // Return Values
    // ------!-------
    return(
        <AuthContext.Provider 
            value={{
                isLoggedIn, login, logout, 
                CriarOrcamento, EditarOrcamento, getOrcamentos, finalizarOrcamento, removerOrcamento,
                getSeries, getIVA,
                getCategorias,
                CriarArtigo, EditarArtigo, getArtigos, getArtigoID, removerArtigo,
                CriarFatura, EditarFatura, getFaturas, getFaturasById, finalizarFatura, removerFatura,
                getClientes, 
                getMetodos,
                enviarEmail,
                isLoading, userToken
            }}>
            {children}
        </AuthContext.Provider>
    );
}

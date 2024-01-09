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
    //      POST
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
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Server responded with an error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received from the server');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up the request:', error.message);
                }
            
                throw error; // Rethrow the error if needed for further handling
            });
    }

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

    const CriarCliente = async () => {
        var token = await this.getToken();
    }

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
    //    GET ALL
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

    const getCentrosCusto = async () =>{
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/cost-centers`,
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

    const getBancos = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/banks`,
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

    const getAnos = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/years`,
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

    const getCidades = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/cities`,
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
    //   GET BY VALUE
    // ------!-------
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

    const getCategoriasByPosto = async (id) =>{
        var token = await this.getToken();
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/categories?workstation=${id}`,
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

    const getClientesById = async (id) => {
        var token = await this.getToken();

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/clients?id=${id}`,
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

    const getClienteCodInterno = async (codInterno) => {
        var token = await this.getToken();

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/clients?internalCode=${codInterno}`,
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

    const getClientByNif = async (nif, iso) => {
        var token = await this.getToken();

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/clients?vatNumber=${nif}&isoCountry=${iso}`,
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
    //      PUT
    // ------!-------
    const EditarFatura = async () => {
        var token = await this.getToken();
    
    }

    const EditarArtigo = async () => {
        var token = await this.getToken();
    
    }

    const EditarOrcamento = async () => {
        var token = await this.getToken();
    
    }

    const EditarCliente = async () => {
        var token = await this.getToken();
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
    
    // TODO - Finalizar fatura
    // !!! Retorna erro 400 !!!
    const finalizarFatura = async (id) => {
        try {
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
                data: data
            };

            const response = await axios.request(config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up the request:', error.message);
            }

            throw error; // Rethrow the error if needed for further handling
        }
    };

    // ------!-------
    //     DELETE
    // ------!-------
    // TODO - Remover fatura - Apenas funciona com faturas finalizadas
    const removerFatura = async (id) => {
        try {
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

        const response = await axios.request(config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up the request:', error.message);
            }

            throw error; // Rethrow the error if needed for further handling
        }
    };

    // TODO - Remover orcamento - Apenas funciona com orcamentos finalizados
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

    // TODO - Remover artigo
    const removerArtigo = async (id) => {
        var token = await this.getToken();
    }

    // TODO - Remover cliente
    const removerCliente = async (id) => {
        var token = await this.getToken();
    }

    // ------!-------
    // Return Values
    // ------!-------
    return(
        <AuthContext.Provider 
            value={{
                //LOGIN & LOGOUT
                isLoggedIn, 
                login, 
                logout, 
                userToken,

                //POST
                enviarEmail,
                CriarOrcamento, 
                CriarFatura, 
                CriarArtigo,
                CriarCliente,

                //GET
                getSeries,
                getAnos,
                getBancos,
                getIVA,
                getOrcamentos,
                getArtigos,
                getFaturas,
                getClientes, 
                getMetodos,
                getAnos,
                getCentrosCusto,
                getCategorias,
                getCidades,

                //GET BY VALUE
                getCategoriasByPosto,
                getArtigoID,
                getFaturasById,
                getClientesById,
                getClienteCodInterno,
                getClientByNif,

                //PUT
                EditarOrcamento,
                finalizarOrcamento,
                EditarArtigo,
                removerArtigo,
                removerCliente,
                removerCliente,
                EditarCliente,
                EditarFatura,
                finalizarFatura,

                //DELETE
                removerOrcamento,
                removerFatura,
                removerArtigo,

                //OUTROS
                isLoading
            }}>
            {children}
        </AuthContext.Provider>
    );
}

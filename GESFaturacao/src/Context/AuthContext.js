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
        } catch(e) {
            ToastAndroid.show('Nome de utilizador ou palavra-passe incorretos.', ToastAndroid.SHORT);
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
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from the server');
                } else {
                    console.error('Error setting up the request:', error.message);
                }            
                throw error;
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

    const CriarCliente = async (
        name, 
        vat, 
        country, 
        address,
        postalCode,
        region,
        city,
        email,
        website,
        mobile,
        telephone,
        fax,
        representativeName,
        representativeEmail,
        representativeMobile,
        representativeTelephone,
        paymentMethod,
        paymentCondition,
        discount,
        accountType,
        internalCode
        ) => {
        var token = await this.getToken();
        
        let data = qs.stringify({
            'name': name,
            'vatNumber': vat,
            'country': country,
            'address': address,
            'postalCode': postalCode,
            'region': region,
            'city': city,
            'email': email,
            'website': website,
            'mobile': mobile,
            'telephone': telephone,
            'fax': fax,
            'representativeName': representativeName,
            'representativeEmail': representativeEmail,
            'representativeMobile': representativeMobile,
            'representativeTelephone': representativeTelephone,
            'paymentMethod': paymentMethod,
            'paymentCondition': paymentCondition,
            'discount': discount,
            'accountType': accountType,
            'internalCode': internalCode
        });

        console.log(JSON.stringify(data));
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/clients`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': token, 
            },
            data : data
        };
    
        return axios.request(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from the server');
                } else {
                    console.error('Error setting up the request:', error.message);
                }
            
                throw error;
            });
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
            url: `${BASE_URL}/categories?all=1`,
            headers: { 
                'Authorization': token
            }
        };
          
        return axios.request(config)
        .then((response) => {
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

    const getRegioes = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/regions`,
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

    const getPaises = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/countries`,
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

    const getMoedas = async () => {
        var token = await this.getToken();
        let data = qs.stringify({ });
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/coins`,
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
            url: `${BASE_URL}/products?id=${id}`,
            headers: { 
                'Authorization': token
            }
        };
          
        return axios.request(config)
        .then((response) => {
        return response.data; 
        })
        .catch((error) => {
            console.log("Erro no authcontext: " + error);
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
        return response.data;
        })
        .catch((error) => {
        console.log(error);
        });
    }

    const getOrcamentoById = async (id) => {
        var token = await this.getToken();

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/budgets?id=${id}`,
            headers: { 
                'Authorization': token
            }
        };

        return axios.request(config)
        .then((response) => {
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
        return response.data;
        })
        .catch((error) => {
        console.log(error);
        });
    }

    // ------!-------
    //      PUT
    // ------!-------
    const EditarFatura = async (id, clienteC, serieC, numeroC, dataC, validadeC, dueDateC, referenciaC, moedaC, descontoC, observacoesC, metodoC, linhasC, finalizarDocumentoC) => {
        var token = await this.getToken();
    
        const linhas = JSON.stringify(linhasC);
        let data = qs.stringify({
            'id': id,
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
            'lines': linhas,
            'payment': metodoC,
        });
        
        console.log('id: ' + id);
        console.log('client: ' + clienteC);
        console.log('serie: ' + serieC);
        console.log('number: ' + numeroC);
        console.log('date: ' + dataC);
        console.log('expiration: ' + validadeC);
        console.log('reference: ' + referenciaC);
        console.log('dueDate: ' + dueDateC);
        console.log('coin: ' + moedaC);
        console.log('discount: ' + descontoC);
        console.log('observations: ' + observacoesC);
        console.log('finalize: ' + finalizarDocumentoC);
        console.log('lines: ' + linhas);
        console.log('payment: ' + metodoC);


        let config = {
            method: 'put',
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
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                    console.error('Error details:', error.message);
                } else if (error.request) {
                    console.error('No response received from the server');
                } else {
                    console.error('Error setting up the request:', error.message);
                }
                throw error; 
            });
    }
    
    const EditarArtigo = async (
        id,
        code,
        name,
        category,
        type,
        qtdStock,
        qtdStockMin,
        stockMin,
        unit,
        pvp,
        iva,
        precoUnit,
        serialNumber,
        retentionValue,
        retentionPercentage,
        exemptionReason,
        observations,
        label,
        calculateMarginUnitaryArticle,
        profitMargin,
        image,
        precoIni
      ) => {
        var token = await this.getToken();
      
        let data = qs.stringify({
          'id': id,
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
          'serialNumber': serialNumber,
          'retention': retentionValue,
          'retentionPercentage': retentionPercentage,
          'calculateMarginUnitaryArticle': calculateMarginUnitaryArticle,
          'profitMargin': profitMargin,
          'exemptionReason': exemptionReason,
          'observations': observations,
          'label': label,
          'image': image,
          'initialPrice': precoIni,
        });

        console.log('Image sent to the api: ' + image);
      
        let config = {
          method: 'put',
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

    const EditarOrcamento = async (id, clienteC, serieC, numeroC, dataC, validadeC, dueDateC, referenciaC, moedaC, descontoC, observacoesC, linhasC, finalizarDocumentoC) => {
        var token = await this.getToken();

        const linhas = JSON.stringify(linhasC);
        console.log('Linhas: ', linhas);
        let data = qs.stringify({
            'id': id,
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
            method: 'put',
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
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                    console.error('Error details:', error.message);
                } else if (error.request) {
                    console.error('No response received from the server');
                } else {
                    console.error('Error setting up the request:', error.message);
                }
                throw error; 
            });
    
    }

    const EditarCliente = async ( 
        id,
        name,
        vat,
        country,
        address,
        postalCode,
        region,
        city,
        email,
        website,
        mobile,
        telephone,
        fax,
        representativeName,
        representativeEmail,
        representativeMobile,
        representativeTelephone,
        paymentMethod,
        paymentCondition,
        discount,
        accountType,
        internalCode
        ) => {
        var token = await this.getToken();

        let data = qs.stringify({
            'id': id,
            'name': name,
            'vatNumber': vat,
            'country': country,
            'address': address,
            'postalCode': postalCode,
            'region': region,
            'city': city,
            'email': email,
            'website': website,
            'mobile': mobile,
            'telephone': telephone,
            'fax': fax,
            'representativeName': representativeName,
            'representativeEmail': representativeEmail,
            'representativeMobile': representativeMobile,
            'representativeTelephone': representativeTelephone,
            'paymentMethod': paymentMethod,
            'paymentCondition': paymentCondition,
            'discount': discount,
            'accountType': accountType,
            'internalCode': internalCode
        });

        console.log(JSON.stringify(data));

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/clients`,
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Authorization': token, 
            },
            data : data
        };

        return axios.request(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                    console.error('Error details:', error.message);
                } else if (error.request) {
                    console.error('No response received from the server');
                } else {
                    console.error('Error setting up the request:', error.message);
                }
                throw error;
            });
    
    }

    const finalizarOrcamento = async (id) => {
        try {
            var token = await this.getToken();
            console.log('ID do orçamento a finalizar (Authcontext): ', id);

            let data = qs.stringify({ 
                'finalizeDocument': id
            });

            let config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `${BASE_URL}/budgets`,
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
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
                console.log(id);
            } else if (error.request) {
                console.error('No response received from the server');
            } else {
                console.error('Error setting up the request:', error.message);
            }
            throw error;
        }
    }
    
    const finalizarFatura = async (id) => {
        try {
            var token = await this.getToken();
            console.log('ID da fatura a finalizar (Authcontext): ', id);

            let data = qs.stringify({ 
                'finalizeDocument': id
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
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
                console.log(id);
            } else if (error.request) {
                console.error('No response received from the server');
            } else {
                console.error('Error setting up the request:', error.message);
            }

            throw error;
        }
    }

    // ------!-------
    //     DELETE
    // ------!-------
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
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                console.error('No response received from the server');
            } else {
                console.error('Error setting up the request:', error.message);
            }
            throw error;
        }
    }

    const removerOrcamento = async (id) => {
        try {
            var token = await this.getToken();
    
            let data = qs.stringify({ 'id': id });
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
    
            const response = await axios.request(config);
                console.log(response.data);
                return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                console.error('No response received from the server');
            } else {
                console.error('Error setting up the request:', error.message);
            }

            throw error;
        }
    }

    // TODO - Remover artigo
    const removerArtigo = async (id) => {
        try {
            var token = await this.getToken();

            let data = qs.stringify({ 'id': id });
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

            const response = await axios.request(config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                console.error('No response received from the server');
            } else {
                console.error('Error setting up the request:', error.message);
            }

            throw error;
        }
    }

    // TODO - Remover cliente
    const removerCliente = async (id) => {
        try {
            var token = await this.getToken();

            let data = qs.stringify({ 'id': id });
            let config = {
                method: 'delete',
                maxBodyLength: Infinity,
                url: `${BASE_URL}/clients`,
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
                console.error('Server responded with an error status:', error.response.status);
                console.error('Error details:', error.response.data);
            } else if (error.request) {
                console.error('No response received from the server');
            } else {
                console.error('Error setting up the request:', error.message);
            }
            throw error;
        }
    }

    // ------!-------
    // Return Values
    // ------!-------
    return (
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
                getMoedas,
                getRegioes,
                getPaises,

                //GET BY VALUE
                getCategoriasByPosto,
                getArtigoID,
                getFaturasById,
                getOrcamentoById,
                getClientesById,
                getClienteCodInterno,
                getClientByNif,

                //PUT
                EditarOrcamento,
                finalizarOrcamento,
                EditarArtigo,
                EditarCliente,
                EditarFatura,
                finalizarFatura,

                //DELETE
                removerOrcamento,
                removerFatura,
                removerArtigo,
                removerCliente,

                //OUTROS
                isLoading
            }}>
            {children}
        </AuthContext.Provider>
    );
}

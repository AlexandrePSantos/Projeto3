import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';

import { ToastAndroid } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [nome, setNome] = useState(null);

    // ------!-------
    // Login & Logout
    // ------!-------
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

    // ------!-------
    //    Faturas
    // ------!-------
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

    const getFaturas = async () =>{
        var token = await this.getToken();
        return axios({
            url: `${BASE_URL}/api/vendas/faturas`,
            method: 'GET',
            timeout: 5000,
            params: {
                opcao: '0',
                pag: '0',
                numRows: '25',
                _token: token
            },
            headers: {
                Accept: 'application/json',
            }
        });
    }

    // ------!-------
    //    Artigos
    // ------!-------
    const CriarArtigo = async (dadosArt) =>{
        console.log(dadosArt);
        var token = await this.getToken();
        return axios({
            url: `${BASE_URL}/api/tabelas/artigos`,
            method: 'POST',
            timeout: 5000,
            data : {
                opcao: '2',
                _token: token,
                codigo_artigo:dadosArt.Codigo,
                nome_artigo: dadosArt.Nome,
                categoria_artigo: dadosArt.Categoria,
                tipo_artigo: dadosArt.Tipo,
                stock_artigo: dadosArt.Stock,
                unidade_artigo: dadosArt.Unidade,
                precoPVP_artigo: dadosArt.PrecoPVP,
                imposto_artigo: dadosArt.IVA , 
                preco_artigo: dadosArt.Preco ,
                codigobarras_artigo: dadosArt.CodigoBarras,
                numeroserie_artigo: dadosArt.SerialNumber,
                retencao_valor_artigo: dadosArt.RetencaoValor,
                retencao_percenteagem_artigo: dadosArt.RetencaoPercentagem,
                observacoes_artigo: dadosArt.DescricaoLonga
        },
        headers: {
            Accept: 'application/json',
        }
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

    // ------!-------
    //   Orcamentos
    // ------!-------
    const CriarOrcamentos = async (clienteC, serieC, numeroC, dataC, validadeC, referenciaC, vencimentoC, moedaC, descontoC, observacoesC, LinhasC, finalizarDocumentoC) => {

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
           
        //const LinhasC = [{"artigo": "0001", "descricao":descricaoC, "qtd":qtdC, "preco": "19.01", "imposto": "1", "motivo":motivoC, "desconto":descontoCL, "retencao":retencaoC}];
        const stringifiedLinhas = JSON.stringify(LinhasC);

        return axios({
            url: 'https://demo.gesfaturacao.pt/gesfaturacao/server/webservices/api/orcamentos/orcamentos',
            method: 'POST',
            timeout: 5000,
            data: qs.stringify({
                opcao: '2',
                _token: userToken,
                cliente: clienteC, 
                serie: serieC, 
                numero: numeroC, 
                data: dataC,  
                validade: validadeC, 
                referencia: referenciaC, 
                vencimento: vencimentoC, 
                moeda: moedaC, 
                desconto: descontoC, 
                observacoes: observacoesC, 
                Linhas: stringifiedLinhas, 
                finalizarDocumento: finalizarDocumentoC
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        })
        .then(async res => {
            console.log(res.data)
            //return res.data
        }).catch(e =>{
            console.log(`Erro: ${e}` + ' Grande Erro');
            setIsLoading(false)
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
    //   Clientes
    // ------!-------
    const criarCliente = async (dadosCli) =>{
        var token = await this.getToken();
        console.log(token)
        console.log(dadosCli)
        axios.post(`${BASE_URL}/api/tabelas/clientes`, {
        opcao: '2',
                    _token: token,
                    nome_cliente: dadosCli.Nome,
                    nif_cliente: dadosCli.Nif,
                    pais_cliente: dadosCli.Pais,
                    endereco_cliente: dadosCli.Endereco,
                    codigopostal_cliente: dadosCli.CodigoPostal,
                    regiao_cliente: dadosCli.Regiao,
                    cidade_cliente: dadosCli.Cidade,
                    email_cliente: dadosCli.Email,
                    website_cliente: dadosCli.Website,
                    tlm_cliente: dadosCli.Telemovel,
                    tlf_cliente: dadosCli.Telefone,
                    fax_cliente: dadosCli.Fax,
                    vencimento_cliente: dadosCli.Vencimento,
                    desconto_cliente: dadosCli.Desconto,
    
        }, {headers: { Accept: 'application/json',}})
    }

    const getClientes = async ()=> {
        
        var token = await this.getToken();

        return axios({
            url: `${BASE_URL}/clients`,
            method: 'GET',
            params: {
                opcao: '0',
                _token: token,
                pag: '0',
                numRows: '25',
                table_usage: '1'
            },
            headers: {
                Accept: 'application/json',
            }
        })
    }

    const getclienteID = async (id) =>{
        console.log("AQUI", id)
        var token = await this.getToken();
        return axios({
            url: `${BASE_URL}/clients`,
            method: 'GET',
            params: {
                opcao: '1',
                idCliente: id,
                _token: token
            },
            headers: {
                Accept: 'application/json',
            },
        });
    }

    const deletecliente = async (id) =>{
        var token = await this.getToken();
        return axios({
            url: `${BASE_URL}/api/tabelas/clientes`,
            method: 'DELETE',
            timeout: 5000,
            data: qs.stringify({
                opcao: '4',
                _token: token,
                idCliente: id
            }),
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
        });
    }

    // ------!-------
    // Return Values
    // ------!-------
    return(
        <AuthContext.Provider value={{login, logout, 
            CriarOrcamentos, getOrcamentos,
            CriarArtigo, getArtigos, 
            CriarFatura, getFaturas,
            criarCliente, getClientes, getclienteID, deletecliente,
            isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function EmpresasLista() {

    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/empresa`);
                setEmpresas(response.data);
            } catch (error) {
                console.error('Ocorreu um erro, tente novamente.\nErro:', error);
            }
        };
        fetchEmpresas();
    }, []);


    return (
        <div>
          <h2>Empresas Cadastradas</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nome}</td>
                  <td>{empresa.cnpj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}
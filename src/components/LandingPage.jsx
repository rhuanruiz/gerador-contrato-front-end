// LandingPage.js
import React from 'react'
import EmpresasLista from './EmpresasLista';
import '../styles/LandingPage.css'

const LandingPage = ({ empresas, representantes }) => {
  const handleGerarDocumento = () => {
    // Lógica para gerar o documento
  };

  return (
    <div className='landing-page'>
      <button onClick={handleGerarDocumento}>Gerar Documento</button>
      <EmpresasLista empresas={empresas} />
    </div>
  );
};

export default LandingPage;

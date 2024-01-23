import React from 'react'
import EmpresasLista from './EmpresasLista';
import { 
  Box, 
  Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';


const style = {
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(31, 30, 30)'
};

const LandingPage = ({ empresas, representantes }) => {
    const handleGerarDocumento = () => {
        // Lógica para gerar o documento
    };

    return (
        <Box sx={style}>
            <Button variant="contained" size="large" style={{ marginBottom: '15vh' }} startIcon={<ArticleIcon />}>Gerar Documento</Button>
            <EmpresasLista empresas={empresas} />
        </Box>
    );
};

export default LandingPage;

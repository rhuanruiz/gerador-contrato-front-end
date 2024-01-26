import React, { 
    useState
} from 'react';
import EmpresasLista from './EmpresasLista';
import { 
  Box, 
  Button
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import GerarDocumento from './GerarDocumento';


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

const LandingPage = ({ empresas }) => {

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Box sx={style}>
            <Button 
                variant="contained" 
                size="large" 
                style={{ marginBottom: '15vh' }} 
                startIcon={<ArticleIcon />} 
                onClick={handleOpenModal}
                >Gerar Documento</Button>
            <GerarDocumento open={openModal} onClose={handleCloseModal} />
            <EmpresasLista empresas={empresas} />
        </Box>
    );
};

export default LandingPage;

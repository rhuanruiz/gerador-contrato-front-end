import React, { 
    useState
} from 'react';
import { 
    Modal, 
    Box,
    Typography, 
    TextField, 
    Button 
} from '@mui/material';
import axios from 'axios';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em'
};

const handleCreate = async (cnpj) => {
    try {
        const dados = {
            cnpj: cnpj
        };
        const response = await axios.post(process.env.REACT_APP_API_URL + "/empresa", dados);
        console.log(response.data);
        setTimeout(() => {
          //this.msg_sucesso = '';
          window.location.reload(true);
        }, 2000);
    } catch (error) {
        console.error('Ocorreu um erro, tente novamente.\nErro:', error);
    }
};

const CriarEmpresa = ({ open, onClose }) => {

    const [cnpj, setCnpj] = useState('');

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>
                    <Typography id="cadastrar-empresa" variant="h6" component="h2" align="center" >
                        Cadastrar Empresa
                    </Typography>
                    <TextField
                        required
                        id="empresa-cnpj"
                        label="CNPJ"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                    />
                    <Box>
                        <Button variant="contained" color="error" onClick={onClose} style={{ marginRight: '20px' }}>Fechar</Button>
                        <Button variant="contained" onClick={() => handleCreate(cnpj)}>Cadastrar</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default CriarEmpresa;
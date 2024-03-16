import React, { 
  useState, 
  useEffect 
} from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box, 
  Button, 
  Paper,
  Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import CriarEmpresa from './CriarEmpresa';
import axios from 'axios';


export default function EmpresasLista() {

    const [empresas, setEmpresas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [feedback, setFeedback] = useState(null);

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

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDelete = async (empresa) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/empresa/${empresa.id}`);
            console.log(response.data);
            setFeedback({
                type: 'success',
                message: 'Empresa excluída com sucesso!'
            });
            setTimeout(() => {
              window.location.reload(true);
            }, 3000);
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Ocorreu um erro, tente novamente.'
            });
            console.error('Ocorreu um erro, tente novamente.\nErro:', error);
        }
    };

    return (
        <Box>
            <Button style={{marginBottom:"0.1rem"}} variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenModal}>Nova Empresa</Button>
            <CriarEmpresa open={openModal} onClose={handleCloseModal} />
                <Box sx={{ height: '25rem', overflowY: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                    <TableContainer component={ Paper }>
                        <Table sx={{ minWidth: 650 }} aria-label="empresas">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Empresa</TableCell>
                                    <TableCell align="center">CNPJ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {empresas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            Ainda não há empresas cadastradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    empresas.map((empresa) => (
                                        <TableRow key={ empresa.id }>
                                            <TableCell component="th" scope="row">{ empresa.nome }</TableCell>
                                            <TableCell>{empresa.cnpj}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" onClick={() => handleDelete(empresa)}>Excluir</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table> 
                        {feedback && (
                            <Alert icon={feedback.type === 'success' ? <CheckIcon /> : <ErrorIcon />} severity={feedback.type}>
                                {feedback.message}
                            </Alert>
                        )} 
                    </TableContainer>
                </Box>
        </Box>
    );
}